import { useEffect, useState } from "react";
import request from "../../../utils/request";
import { showAlert } from "../../../utils/alert";

const StockAlert = () => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        id: null,
        Stock_alert: 5,
        Qty_alert: 0,
        remark: "",
        is_alert: false
    });
    const [notifications, setNotifications] = useState({
        lowStock: false,
        availableStock: false,
        unavailableStock: false
    });

    // Fetch alert settings from API
    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await request("api/alert-setting", "GET");
            if (Array.isArray(response) && response.length > 0) {
                const data = response[0];
                setSettings({
                    id: data.id,
                    Stock_alert: data.Stock_alert || 5,
                    Qty_alert: data.Qty_alert || 0,
                    remark: data.remark || "",
                    is_alert: data.is_alert || false
                });
                // Parse notifications from remark if stored as JSON
                try {
                    const notifData = JSON.parse(data.remark || "{}");
                    setNotifications({
                        lowStock: notifData.lowStock || false,
                        availableStock: notifData.availableStock || false,
                        unavailableStock: notifData.unavailableStock || false
                    });
                } catch {
                    // If remark is not JSON, use defaults
                }
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    // Handle notification toggle
    const handleNotificationToggle = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Save settings
    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                Stock_alert: settings.Stock_alert,
                Qty_alert: settings.Qty_alert,
                remark: JSON.stringify(notifications),
                is_alert: notifications.lowStock || notifications.availableStock || notifications.unavailableStock
            };

            if (settings.id) {
                await request(`api/alert-setting/${settings.id}`, "PUT", payload);
            } else {
                await request("api/alert-setting", "POST", payload);
            }
            showAlert("success", "Settings saved successfully");
            fetchSettings();
        } catch (error) {
            console.error("Error saving settings:", error);
            showAlert("error", "Error saving settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="stock-alert-container">
            {/* Header */}
            <div className="stock-alert-header">
                <span className="header-icon">🔔</span>
                <span>Stock Alert Settings</span>
            </div>

            {/* Stock Alert Threshold */}
            <div className="setting-section">
                <h3 className="section-title">Stock Alert Threshold</h3>
                <p className="section-description">Set the minimum quantity before low stock alerts trigger</p>
                <div className="input-group">
                    <span className="input-icon">📦</span>
                    <input
                        type="number"
                        name="Stock_alert"
                        value={settings.Stock_alert}
                        onChange={handleInputChange}
                        min="0"
                        className="threshold-input"
                    />
                    <span className="input-suffix">units</span>
                </div>
            </div>

            <div className="section-divider"></div>

            {/* Quantity Alert Threshold */}
            <div className="setting-section">
                <h3 className="section-title">Quantity Alert Threshold</h3>
                <p className="section-description">Set additional quantity threshold for alerts</p>
                <div className="input-group">
                    <span className="input-icon">⚠️</span>
                    <input
                        type="number"
                        name="Qty_alert"
                        value={settings.Qty_alert}
                        onChange={handleInputChange}
                        min="0"
                        className="threshold-input"
                    />
                    <span className="input-suffix">units</span>
                </div>
            </div>

            <div className="section-divider"></div>

            {/* Stock Status Notifications */}
            <div className="setting-section">
                <h3 className="section-title">Stock Status Notifications</h3>
                <p className="section-description">Choose which stock status changes you want to be notified about</p>

                {/* Low Stock Alerts */}
                <div className="notification-item">
                    <div className="notification-info">
                        <span className="notification-icon low">↓</span>
                        <div>
                            <h4 className="notification-title">Low Stock Alerts</h4>
                            <p className="notification-desc">Get notified when products fall below alert threshold</p>
                        </div>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={notifications.lowStock}
                            onChange={() => handleNotificationToggle('lowStock')}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                <div className="notification-divider"></div>

                {/* Available Stock Alerts */}
                <div className="notification-item">
                    <div className="notification-info">
                        <span className="notification-icon available">✓</span>
                        <div>
                            <h4 className="notification-title">Available Stock Alerts</h4>
                            <p className="notification-desc">Get notified about available stock updates</p>
                        </div>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={notifications.availableStock}
                            onChange={() => handleNotificationToggle('availableStock')}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>

                <div className="notification-divider"></div>

                {/* Unavailable Stock Alerts */}
                <div className="notification-item">
                    <div className="notification-info">
                        <span className="notification-icon unavailable">✕</span>
                        <div>
                            <h4 className="notification-title">Unavailable Stock Alerts</h4>
                            <p className="notification-desc">Get notified when products become out of stock</p>
                        </div>
                    </div>
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={notifications.unavailableStock}
                            onChange={() => handleNotificationToggle('unavailableStock')}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                </div>
            </div>

            {/* Save Button */}
            <div className="save-section">
                <button 
                    className="btn-save-settings" 
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Saving..." : "Save Settings"}
                </button>
            </div>
        </div>
    );
};

export default StockAlert;
