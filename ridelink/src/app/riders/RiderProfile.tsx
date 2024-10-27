//Component for displaying rider profile details

// src/app/riders/RiderProfile.tsx

import React from 'react';

const RiderProfile = ({ user }) => {
    if (!user) return null;

    return (
        <div className="rider-profile">
            <h2>Your Profile</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.publicMetadata?.role || "Rider"}</p>
        </div>
    );
};

export default RiderProfile;
