import { useEffect, useRef } from 'react';
import Auth0Lock from 'auth0-lock';

export default function EmbeddedLock({ show, mode, onHide }) {
    const lockRef = useRef();

    useEffect(() => {
        if (!show) {
            // hide if it was rendered previously
            lockRef.current?.hide();
            return;
        }

        // instantiate Lock
        const lock = new Auth0Lock(
            process.env.VITE_AUTH0_DOMAIN,
            process.env.VITE_AUTH0_CLIENT_ID,
            {
                container: 'auth0-lock-container',
                // if you want the popup style instead:
                // autoclose: true,
                // closable: true,
                // popup: true,

                // force signup or login screen
                initialScreen: mode === 'signup' ? 'signUp' : 'login',
                // you can pass any other Lock options here
            }
        );

        lock.show();
        lockRef.current = lock;

        return () => lockRef.current?.hide();
    }, [show, mode]);

    // this div is where Lock will inject itself
    return show ? <div id="auth0-lock-container" /> : null;

}