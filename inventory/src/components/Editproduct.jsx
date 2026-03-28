import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const EditProduct = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [supplier, setSupplier] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            const { name, quantity, price, category, supplier } = response.data;
            setName(name);
            setQuantity(quantity);
            setPrice(price);
            setCategory(category || '');
            setSupplier(supplier || '');
        } catch (err) {
            alert('Failed to load product data');
            navigate('/');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.put(`/products/${id}`, { name, quantity, price, category, supplier });
            navigate('/');
        } catch (err) {
            alert('Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) return <div style={{ padding: '40px' }}>Loading product details...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '30px' }}>✏️ Edit Product</h1>

            <div className="form-card glass-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            className="glass-input form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                className="glass-input form-input"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                required
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>Price (Rs)</label>
                            <input
                                type="number"
                                step="0.01"
                                className="glass-input form-input"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label>Category</label>
                            <input
                                type="text"
                                className="glass-input form-input"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Supplier</label>
                            <input
                                type="text"
                                className="glass-input form-input"
                                value={supplier}
                                onChange={(e) => setSupplier(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '20px' }}>

                        {loading ? 'Saving Changes...' : 'Update Product'}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        style={{
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            width: '100%',
                            marginTop: '15px',
                            fontSize: '14px'
                        }}
                    >
                        Cancel and Return
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
