import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';

export default function Auth0ProviderWithHistory({ children }) {
    const navigate = useNavigate();
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

    const onRedirectCallback = (appState) => {
        // take them back to where they were, or the homepage
        navigate(appState?.returnTo || '/task', { replace: true });
    };
    if (!(domain && clientId)) {
        return <div>Error: Auth0 domain or client ID is not configured.</div>;
    }

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: window.location.origin
            }}
            onRedirectCallback={onRedirectCallback}
            useRefreshTokens={true}
            cacheLocation="localstorage"
        >
            {children}
        </Auth0Provider>
    );
}