import React, { useRef, useState, useMemo, useEffect } from "react";
import ForceGraph3D from "react-force-graph-3d";
import { habits, relations } from "../data/mock_data";
import * as THREE from 'three';

const MindMap = () => {
    const fgRef = useRef();
    const radius = useMemo(() => Math.max(32, habits.length * 8), [habits.length]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [hoveredNode, setHoveredNode] = useState(null);
    const nodeObjectMap = useRef(new Map());
    const [neighborIds, setNeighborIds] = useState(new Set());

    const glowMaterials = useMemo(() => ({
        primary: new THREE.MeshBasicMaterial({
            color: 0x4dc9ff,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        }),
        secondary: new THREE.MeshBasicMaterial({
            color: 0x8ae2ff,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        }),
        highlight: new THREE.MeshBasicMaterial({
            color: 0xffdf4d,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        })
    }), []);

    const graphData = useMemo(() => {
        // Place nodes on a sphere
        const N = habits.length;
        // sphere radius
        const ga = Math.PI * (3 - Math.sqrt(5))
        const nodes = habits.map((habit, i) => {
            // Spherical coordinates
            const zNorm = 1 - (2 * i) / (N - 1);
            const theta = ga * i;
            const rxy = Math.sqrt(1 - zNorm * zNorm);
            return {
                id: habit.id,
                name: habit.name,
                frequency: habit.frequency,
                duration: habit.duration,
                x: radius * rxy * Math.cos(theta),
                y: radius * rxy * Math.sin(theta),
                z: radius * zNorm,
            };
        });

        // Create name-to-id mapping
        const nameToId = {};
        habits.forEach(habit => {
            nameToId[habit.name] = habit.id;
        });

        // Create link map for bidirectional relationships
        const linkMap = new Map();

        relations.Relation.forEach(rel => {
            const sourceId = nameToId[rel.From];
            const targetId = nameToId[rel.to];

            if (!sourceId || !targetId) return;

            // Create unique key for the pair
            const key = [sourceId, targetId].sort().join('|');

            if (!linkMap.has(key)) {
                linkMap.set(key, {
                    source: sourceId,
                    target: targetId,
                    probabilities: {}
                });
            }

            // Store probability in both directions
            linkMap.get(key).probabilities[`${sourceId}-${targetId}`] = rel.Probability;
        });

        // Convert map to links array
        const links = Array.from(linkMap.values());

        return { nodes, links };
    }, [habits, relations]);


    useEffect(() => {
        if (!selectedNode) {
            setNeighborIds(new Set());
            return;
        }
        const nset = new Set();
        graphData.links.forEach(l => {
            const { source, target } = l;
            const src = typeof source === 'object' ? source.id : source;
            const tgt = typeof target === 'object' ? target.id : target;
            if (src === selectedNode.id) nset.add(tgt);
            if (tgt === selectedNode.id) nset.add(src);
        });
        setNeighborIds(nset);
    }, [selectedNode, graphData.links]);

    useEffect(() => {
        if (!fgRef.current) return;
        const controls = fgRef.current.controls();
        controls.enableRotate = true;
        controls.enableZoom = true;
        controls.enablePan = true;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.3;
        return () => {
            controls.autoRotate = false;
        };
    }, []);

    // Create a more modern label canvas
    function createTextCanvas(text, color = '#ffffff') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 320;
        canvas.height = 60;
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, 'rgba(30,34,45,0.95)');
        gradient.addColorStop(1, 'rgba(50,60,80,0.95)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // White border
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        // Draw text
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '600 22px "Segoe UI", Arial, sans-serif';
        ctx.fillStyle = color;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        ctx.shadowBlur = 0;
        return canvas;
    }

    const createNodeWithGlow = (node) => {
        const obj = new THREE.Object3D();
        // Main sphere
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(4, 32, 32),
            new THREE.MeshPhongMaterial({
                color: new THREE.Color(node.color || '#6ec6ff'),
                shininess: 80,
                transparent: true,
                opacity: 0.98,
                specular: 0xdddddd
            })
        );
        obj.add(sphere);
        // Glow effect (initially hidden)
        const glowMesh = new THREE.Mesh(
            new THREE.SphereGeometry(4.8, 32, 32),
            glowMaterials.primary
        );
        glowMesh.visible = false;
        glowMesh.raycast = () => { };
        obj.userData.glow = glowMesh;
        obj.add(glowMesh);

        const pulse = new THREE.Mesh(
            new THREE.SphereGeometry(4.5, 32, 32),
            new THREE.MeshBasicMaterial({ /* … */ })
        );
        pulse.visible = false;
        pulse.raycast = () => { };             // ← skip pointer events
        obj.userData.pulse = pulse;
        obj.add(pulse)
        // Label sprite
        const sprite = new THREE.Sprite(
            new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(createTextCanvas(node.name)), transparent: true })
        );
        sprite.scale.set(32, 8, 1);
        sprite.position.y = -8;
        sprite.raycast = () => { };
        obj.add(sprite);

        nodeObjectMap.current.set(node.id, obj);
        return obj;
    };


    useEffect(() => {
        let anim;
        const tick = () => {
            const t = Date.now() / 1000;
            graphData.nodes.forEach(({ id }) => {
                const obj = nodeObjectMap.current.get(id);
                if (!obj) return;
                const glow = obj.userData.glow;
                const active =
                    (selectedNode?.id === id) ||
                    (hoveredNode?.id === id) ||
                    neighborIds.has(id);

                glow.visible = Boolean(glow && active);
                if (glow && active) {
                    const s = 1 + 0.1 * Math.sin(t * 5);
                    glow.scale.set(s, s, s);
                }
            });
            anim = requestAnimationFrame(tick);
        };
        tick();
        return () => cancelAnimationFrame(anim);
    }, [selectedNode, hoveredNode, neighborIds, graphData.nodes]);

    useEffect(() => {
        let anim;
        const tick = () => {
            const t = Date.now() / 1000;
            graphData.nodes.forEach(({ id }) => {
                const obj = nodeObjectMap.current.get(id);
                if (!obj) return;
                let pulse = obj.userData.pulse;
                if (!pulse) {
                    pulse = new THREE.Mesh(
                        new THREE.SphereGeometry(4.5, 32, 32),
                        new THREE.MeshBasicMaterial({ color: 0xffdf4d, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending })
                    );
                    pulse.visible = false;
                    obj.add(pulse);
                    obj.userData.pulse = pulse;
                }
                const isActive = (selectedNode?.id === id) || (hoveredNode?.id === id);
                pulse.visible = isActive;
                if (isActive) {
                    const s = 1 + 0.1 * Math.sin(t * 5);
                    pulse.scale.set(s, s, s);
                }
            });
            anim = requestAnimationFrame(tick);
        };
        tick();
        return () => cancelAnimationFrame(anim);
    }, [selectedNode, hoveredNode, graphData.nodes]);

    return (
        <div className="relative w-full h-full bg-gray-950">
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 30 }).map((_, i) => (
                    <div key={i} className="absolute rounded-full bg-white"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            opacity: Math.random() * 0.3 + 0.1,
                            animation: `float ${Math.random() * 20 + 10}s infinite ease-in-out`,
                            animationDelay: `${Math.random() * 5}s`
                        }} />
                ))}
            </div>
            <ForceGraph3D
                ref={fgRef}
                graphData={graphData}
                nodeId="id"
                // Always show a clean label below each node
                nodeLabel={() => ''}
                nodeAutoColorBy="name"
                nodeResolution={24}
                nodeOpacity={node => {
                    if (!selectedNode) return 1;
                    const isSelected = node.id === selectedNode.id;
                    const isNeighbor = graphData.links.some(
                        l => (l.source === selectedNode.id && l.target === node.id) ||
                            (l.target === selectedNode.id && l.source === node.id)
                    );
                    return isSelected || isNeighbor ? 1 : 0.2;
                }}
                nodeRelSize={4.5}
                linkCurvature={0.25}
                linkWidth={link => {
                    const keySrc = typeof link.source === 'object' ? link.source.id : link.source;
                    const keyTgt = typeof link.target === 'object' ? link.target.id : link.target;
                    const isSelectedLink =
                        (keySrc === selectedNode?.id && neighborIds.has(keyTgt)) ||
                        (keyTgt === selectedNode?.id && neighborIds.has(keySrc));
                    // thicker if it’s one of the selected-node’s links:
                    return isSelectedLink
                        ? Math.min((Object.values(link.probabilities).reduce((a, b) => a + b, 0) / link.probabilities.length) / 8, 6)
                        : Math.min((Object.values(link.probabilities).reduce((a, b) => a + b, 0) / link.probabilities.length) / 12, 5.5);
                }}
                linkOpacity={link => {
                    if (!selectedNode) return 1;
                    return link.source === selectedNode.id || link.target === selectedNode.id ? 1 : 0.1;
                }}
                linkLabel={link => {
                    const { source, target, probabilities } = link;
                    const forwardKey = `${source.id}-${target.id}`;
                    const reverseKey = `${target.id}-${source.id}`;
                    return `
                        <div style="background: rgba(30,34,45,0.92); padding: 10px; border-radius: 7px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 15px; color: #fff; border: 1px solid #444;">
                            <strong>${source.name}</strong> → <strong>${target.name}</strong>: <span style="color:#4caf50;">${probabilities[forwardKey] || '--'}%</span><br/>
                            ${probabilities[reverseKey] ? `<strong>${target.name}</strong> → <strong>${source.name}</strong>: <span style="color:#4caf50;">${probabilities[reverseKey]}%</span>` : ''}
                        </div>
                    `;
                }}
                linkColor={link => {
                    const keySrc = typeof link.source === 'object' ? link.source.id : link.source;
                    const keyTgt = typeof link.target === 'object' ? link.target.id : link.target;
                    const isSelectedLink =
                        (keySrc === selectedNode?.id && neighborIds.has(keyTgt)) ||
                        (keyTgt === selectedNode?.id && neighborIds.has(keySrc));
                    return isSelectedLink
                        ? 'rgba(35, 235, 88, 0.8)'       // bright glow color
                        : 'rgba(100,100,100, 0.2)';
                }}
                onNodeDragEnd={node => {
                    node.fx = node.x;
                    node.fy = node.y;
                    node.fz = node.z;
                }}
                onNodeClick={setSelectedNode}
                onNodeHover={setHoveredNode}
                d3VelocityDecay={0.28}
                warmupTicks={0}
                cooldownTicks={0}
                showNavInfo={true}
                enableNodeDrag={true}
                backgroundColor="rgba(0,0,0,0)"
                rendererConfig={{ antialias: true, alpha: true }}
                nodeThreeObject={node => {
                    const obj = createNodeWithGlow(node);
                    return obj;
                }}
            />
        </div >
    )
}

export default MindMap;