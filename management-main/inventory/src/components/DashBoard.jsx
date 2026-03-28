import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getUserRole } from '../services/api';
import { Button, Snackbar, Alert } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [alertOpen, setAlertOpen] = useState(false);
    const navigate = useNavigate();
    const role = getUserRole();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            const data = response.data.content ? response.data.content : response.data;
            setProducts(data);
            const lowStockItems = data.filter(p => p.quantity < 30);
            if (lowStockItems.length > 0) {
                setAlertOpen(true);
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await api.delete(`/products/${id}`);
                setProducts(products.filter(p => p.id !== id));
            } catch (err) {
                alert('Failed to delete product');
            }
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/reports/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'inventory_report.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Failed to export report');
        }
    };

    const isManagement = role === 'ADMIN' || role === 'MANAGER';
    const lowStockCount = products.filter(p => p.quantity < 30).length;

    if (loading) return <div style={{ padding: '40px' }}>Loading application...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '32px' }}>Inventory Overview</h1>
                <Button variant="contained" onClick={handleExport} color="primary" sx={{ width: 'auto' }}>
                    🚢 Export CSV
                </Button>
            </div>

            {lowStockCount > 0 && (
                <div style={{
                    background: '#fff1f2',
                    border: '1px solid #fda4af',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    marginBottom: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#e11d48',
                    fontWeight: '600'
                }}>
                    <span style={{ fontSize: '20px' }}>⚠️</span>
                    <span>System Alert: {lowStockCount} items are running low on stock. Please review the inventory.</span>
                </div>
            )}

            <div className="stats-grid">

                <div className="stat-card glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="stat-label">Total Products</span>
                    <span className="stat-value">{products.length}</span>
                </div>
                <div className="stat-card glass-card" style={{ borderLeft: '4px solid var(--accent-red)', display: 'flex', flexDirection: 'column' }}>
                    <span className="stat-label">Low Stock Alert</span>
                    <span className="stat-value" style={{ color: 'var(--accent-red)' }}>{lowStockCount}</span>
                </div>
                <div className="stat-card glass-card" style={{ borderLeft: '4px solid var(--accent-green)', display: 'flex', flexDirection: 'column' }}>
                    <span className="stat-label">Total Value</span>
                    <span className="stat-value">
                        Rs{products.reduce((acc, p) => acc + (p.price * p.quantity), 0).toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                <div className="chart-card glass-card" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Stock Quantity Overview</h3>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={products} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                                <XAxis dataKey="name" stroke="var(--text-muted)" style={{ fontSize: '12px' }} />
                                <YAxis stroke="var(--text-muted)" style={{ fontSize: '12px' }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                                <Bar dataKey="quantity" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-card glass-card" style={{ padding: '24px', height: '400px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '20px', color: 'var(--text-main)' }}>Product Value Distribution</h3>
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={products.map(p => ({ name: p.name, value: p.price * p.quantity }))}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {products.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 7]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} formatter={(value) => `Rs${value.toFixed(2)}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="table-container glass-card">
                <h3>Current Inventory</h3>
                <table style={{ marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Status</th>
                            {isManagement && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td style={{ fontWeight: '500' }}>{product.name}</td>
                                <td style={{ color: product.quantity < 30 ? 'var(--accent-red)' : 'inherit' }}>
                                    {product.quantity}
                                    {product.quantity < 30 && (
                                        <div style={{ fontSize: '11px', color: 'var(--accent-red)', marginTop: '4px' }}>
                                            ⚠️ Low Stock - Reorder Required
                                        </div>
                                    )}
                                </td>
                                <td>Rs{product.price.toFixed(2)}</td>
                                <td>
                                    <span className={`badge ${product.quantity < 30 ? 'badge-warning' : 'badge-success'}`}>
                                        {product.quantity < 30 ? 'Risk' : 'Optimal'}
                                    </span>
                                </td>
                                {isManagement && (
                                    <td>
                                        <button
                                            onClick={() => navigate(`/edit/${product.id}`)}
                                            style={{ background: 'transparent', color: 'var(--accent-blue)', marginRight: '15px' }}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            style={{ background: 'transparent', color: 'var(--accent-red)' }}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                <Alert onClose={handleCloseAlert} severity="warning" sx={{ width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    Warning: {lowStockCount} items are running low on stock!
                </Alert>
            </Snackbar>
        </div>
    );
};

export default Dashboard;
