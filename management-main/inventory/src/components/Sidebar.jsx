import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getUserRole } from '../services/api';
import { Menu, MenuItem, Avatar, IconButton } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const Sidebar = () => {
    const navigate = useNavigate();
    const role = getUserRole();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isManagement = role === 'ADMIN' || role === 'MANAGER';

    return (
        <aside className="sidebar glass-card">
            <div className="logo" style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '32px' }}>📦</span>
                <span>InvManager</span>
            </div>

            <div className="user-profile-section" style={{ 
                marginBottom: '30px', 
                padding: '12px', 
                background: 'var(--bg-tertiary)', 
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar sx={{ bgcolor: 'var(--brand-primary)', width: 32, height: 32 }}>
                        {role ? role.charAt(0).toUpperCase() : 'U'}
                    </Avatar>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--text-main)' }}>{role}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Logged In</span>
                    </div>
                </div>
                <IconButton onClick={handleClick} size="small">
                    <AccountCircleIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        elevation: 3,
                        sx: { mt: 1, minWidth: 150, borderRadius: 'var(--radius-sm)' }
                    }}
                >
                    <MenuItem onClick={handleLogout} sx={{ color: 'var(--error)', gap: '10px' }}>
                        <LogoutIcon fontSize="small" /> Logout
                    </MenuItem>
                </Menu>
            </div>

            <nav className="nav-links">
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <span>📊</span> Dashboard
                </NavLink>

                {isManagement && (
                    <NavLink
                        to="/add"
                        className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                    >
                        <span>➕</span> Add Product
                    </NavLink>
                )}
            </nav>
        </aside>
    );
};

export default Sidebar;
