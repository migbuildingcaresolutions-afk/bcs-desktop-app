import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea } from '../components';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const CompanySettingsView = () => {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    company_name: '',
    business_name: '',
    logo_url: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    website: '',
    license_number: '',
    ein_tax_id: '',
    estimates_legal_disclaimer: '',
    invoices_legal_disclaimer: '',
    payment_terms: '',
    warranty_text: '',
    square_access_token: '',
    square_location_id: '',
    stripe_api_key: '',
    stripe_publishable_key: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/company-settings`);
      const data = await response.json();
      // Convert null values to empty strings
      const cleanedData = Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key] === null ? '' : data[key];
        return acc;
      }, {});
      setFormData(cleanedData);
    } catch (error) {
      console.error('Error fetching company settings:', error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    try {
      const response = await fetch(`${API_BASE}/company-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Error saving company settings:', error);
      alert('Error saving settings');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Company Settings</h1>
          <p className="text-gray-600 mt-1">Configure your company branding, legal disclaimers, and payment integration</p>
        </div>
        {saved && (
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            Settings Saved!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Information */}
        <Card title="Company Information">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Company Name *"
              name="company_name"
              value={formData.company_name || ''}
              onChange={handleChange}
              placeholder="ABC Construction Services"
              required
            />
            <Input
              label="Business Name (DBA)"
              name="business_name"
              value={formData.business_name || ''}
              onChange={handleChange}
              placeholder="Doing Business As..."
            />
            <Input
              label="Logo URL"
              name="logo_url"
              value={formData.logo_url || ''}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
            />
            <Input
              label="Website"
              name="website"
              value={formData.website || ''}
              onChange={handleChange}
              placeholder="https://www.yourcompany.com"
            />
            <Input
              label="License Number"
              name="license_number"
              value={formData.license_number || ''}
              onChange={handleChange}
              placeholder="LIC-123456"
            />
            <Input
              label="EIN / Tax ID"
              name="ein_tax_id"
              value={formData.ein_tax_id || ''}
              onChange={handleChange}
              placeholder="12-3456789"
            />
          </div>
        </Card>

        {/* Contact Information */}
        <Card title="Contact Information">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Address Line 1"
              name="address_line1"
              value={formData.address_line1 || ''}
              onChange={handleChange}
              placeholder="123 Main Street"
            />
            <Input
              label="Address Line 2"
              name="address_line2"
              value={formData.address_line2 || ''}
              onChange={handleChange}
              placeholder="Suite 100"
            />
            <Input
              label="City"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              placeholder="Anytown"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="State"
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
                placeholder="CA"
              />
              <Input
                label="ZIP Code"
                name="zip"
                value={formData.zip || ''}
                onChange={handleChange}
                placeholder="90210"
              />
            </div>
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="(555) 123-4567"
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              placeholder="contact@yourcompany.com"
            />
          </div>
        </Card>

        {/* Legal & Terms */}
        <Card title="Legal Disclaimers & Terms">
          <div className="space-y-4">
            <Textarea
              label="Estimates Legal Disclaimer"
              name="estimates_legal_disclaimer"
              value={formData.estimates_legal_disclaimer || ''}
              onChange={handleChange}
              rows={3}
              placeholder="This estimate is valid for 30 days. Prices subject to change based on material costs and unforeseen conditions."
            />
            <Textarea
              label="Invoices Legal Disclaimer"
              name="invoices_legal_disclaimer"
              value={formData.invoices_legal_disclaimer || ''}
              onChange={handleChange}
              rows={3}
              placeholder="Payment is due upon receipt. Late payments subject to 1.5% monthly finance charge."
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Payment Terms"
                name="payment_terms"
                value={formData.payment_terms || ''}
                onChange={handleChange}
                placeholder="Net 30"
              />
              <Input
                label="Warranty Period"
                name="warranty_text"
                value={formData.warranty_text || ''}
                onChange={handleChange}
                placeholder="All work is guaranteed for 1 year from date of completion."
              />
            </div>
          </div>
        </Card>

        {/* Payment Integration */}
        <Card title="Payment Integration">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">■</span> Square
              </h3>
              <div className="grid grid-cols-2 gap-4 pl-8">
                <Input
                  label="Square Access Token"
                  name="square_access_token"
                  type="password"
                  value={formData.square_access_token || ''}
                  onChange={handleChange}
                  placeholder="EAAAxxxxxxxxxxxxxxxx"
                />
                <Input
                  label="Square Location ID"
                  name="square_location_id"
                  value={formData.square_location_id || ''}
                  onChange={handleChange}
                  placeholder="LXXXXXXXXXXXXXXX"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 pl-8">
                Get your credentials from: <a href="https://developer.squareup.com/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Square Developer Dashboard</a>
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl text-purple-600">S</span> Stripe
              </h3>
              <div className="grid grid-cols-2 gap-4 pl-8">
                <Input
                  label="Stripe Secret Key"
                  name="stripe_api_key"
                  type="password"
                  value={formData.stripe_api_key || ''}
                  onChange={handleChange}
                  placeholder="sk_live_xxxxxxxxxxxxxxxx"
                />
                <Input
                  label="Stripe Publishable Key"
                  name="stripe_publishable_key"
                  value={formData.stripe_publishable_key || ''}
                  onChange={handleChange}
                  placeholder="pk_live_xxxxxxxxxxxxxxxx"
                />
              </div>
              <p className="text-sm text-gray-600 mt-2 pl-8">
                Get your credentials from: <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe API Keys</a>
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3 sticky bottom-0 bg-gray-100 py-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => fetchSettings()}
          >
            Reset
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanySettingsView;
