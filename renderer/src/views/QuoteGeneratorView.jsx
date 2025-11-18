import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Table, Input, Select } from '../components';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const QuoteGeneratorView = () => {
  const [clients, setClients] = useState([]);
  const [priceList, setPriceList] = useState([]);
  const [pricingRules, setPricingRules] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [quoteData, setQuoteData] = useState({
    client_id: '',
    title: '',
    description: '',
    pricing_rule_id: 1
  });

  useEffect(() => {
    fetchClients();
    fetchPriceList();
    fetchPricingRules();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchTerm || selectedCategory) {
      fetchPriceList();
    }
  }, [searchTerm, selectedCategory]);

  const fetchClients = async () => {
    try {
      const response = await fetch(`${API_BASE}/clients`);
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchPriceList = async () => {
    try {
      let url = `${API_BASE}/price-list?active=true`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;

      const response = await fetch(url);
      const data = await response.json();
      setPriceList(data);
    } catch (error) {
      console.error('Error fetching price list:', error);
    }
  };

  const fetchPricingRules = async () => {
    try {
      const response = await fetch(`${API_BASE}/quotes/pricing-rules/list`);
      const data = await response.json();
      setPricingRules(data);
    } catch (error) {
      console.error('Error fetching pricing rules:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/price-list/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const addPriceItem = (priceItem) => {
    const newLineItem = {
      price_list_id: priceItem.id,
      xactimate_code: priceItem.xactimate_code,
      description: priceItem.item_name,
      quantity: 1,
      unit: priceItem.unit,
      unit_price: priceItem.unit_price,
      labor_hours: priceItem.labor_hours,
      total: priceItem.unit_price
    };

    setLineItems([...lineItems, newLineItem]);
    setShowPriceModal(false);
  };

  const updateLineItem = (index, field, value) => {
    const updated = [...lineItems];
    updated[index][field] = value;

    // Recalculate total
    if (field === 'quantity' || field === 'unit_price') {
      updated[index].total = updated[index].quantity * updated[index].unit_price;
    }

    setLineItems(updated);
  };

  const removeLineItem = (index) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const selectedRule = pricingRules.find(r => r.id === parseInt(quoteData.pricing_rule_id)) || pricingRules[0];

    if (!selectedRule) return { subtotal: 0, overheadProfit: 0, tax: 0, total: 0 };

    const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
    const overheadProfit = subtotal * ((selectedRule.overhead_percentage + selectedRule.profit_percentage) / 100);
    const taxableAmount = subtotal + overheadProfit;
    const tax = taxableAmount * (selectedRule.tax_percentage / 100);
    const total = taxableAmount + tax;

    return {
      subtotal: subtotal.toFixed(2),
      overheadProfit: overheadProfit.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      totalLaborHours: lineItems.reduce((sum, item) => sum + (item.labor_hours * item.quantity), 0).toFixed(2)
    };
  };

  const handleGenerateQuote = async () => {
    if (!quoteData.client_id || !quoteData.title) {
      alert('Please select a client and enter a quote title');
      return;
    }

    if (lineItems.length === 0) {
      alert('Please add at least one line item');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...quoteData,
          line_items: lineItems
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Quote ${result.estimate.estimate_number} created successfully!\nTotal: $${result.totals.total}`);

        // Reset form
        setQuoteData({
          client_id: '',
          title: '',
          description: '',
          pricing_rule_id: 1
        });
        setLineItems([]);
      }
    } catch (error) {
      console.error('Error creating quote:', error);
      alert('Error creating quote');
    }
  };

  const totals = calculateTotals();

  const lineItemColumns = [
    { key: 'xactimate_code', label: 'Code', width: '10%' },
    { key: 'description', label: 'Description', width: '30%' },
    {
      key: 'quantity',
      label: 'Qty',
      width: '10%',
      render: (item, index) => (
        <Input
          type="number"
          step="0.01"
          value={item.quantity}
          onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
          className="w-20"
        />
      )
    },
    { key: 'unit', label: 'Unit', width: '8%' },
    {
      key: 'unit_price',
      label: 'Unit Price',
      width: '12%',
      render: (item, index) => (
        <Input
          type="number"
          step="0.01"
          value={item.unit_price}
          onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
          className="w-24"
        />
      )
    },
    {
      key: 'labor_hours',
      label: 'Labor Hrs',
      width: '10%',
      render: (item) => <span className="text-sm">{(item.labor_hours * item.quantity).toFixed(2)}</span>
    },
    {
      key: 'total',
      label: 'Total',
      width: '12%',
      render: (item) => <span className="font-semibold">${item.total.toFixed(2)}</span>
    },
    {
      key: 'actions',
      label: '',
      width: '8%',
      render: (item, index) => (
        <Button size="sm" variant="danger" onClick={() => removeLineItem(index)}>
          Remove
        </Button>
      )
    }
  ];

  const priceListColumns = [
    { key: 'xactimate_code', label: 'Code', width: '12%' },
    { key: 'item_name', label: 'Item', width: '28%' },
    { key: 'category', label: 'Category', width: '15%' },
    { key: 'unit', label: 'Unit', width: '10%' },
    {
      key: 'unit_price',
      label: 'Price',
      width: '15%',
      render: (item) => `$${item.unit_price.toFixed(2)}`
    },
    {
      key: 'actions',
      label: '',
      width: '20%',
      render: (item) => (
        <Button size="sm" onClick={() => addPriceItem(item)}>
          + Add to Quote
        </Button>
      )
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <Card title="Quote Information">
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Client"
            value={quoteData.client_id}
            onChange={(e) => setQuoteData({ ...quoteData, client_id: e.target.value })}
            required
          >
            <option value="">Select Client</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name} {client.company ? `(${client.company})` : ''}
              </option>
            ))}
          </Select>
          <Select
            label="Pricing Rule"
            value={quoteData.pricing_rule_id}
            onChange={(e) => setQuoteData({ ...quoteData, pricing_rule_id: e.target.value })}
          >
            {pricingRules.map(rule => (
              <option key={rule.id} value={rule.id}>
                {rule.rule_name} (O&P: {rule.overhead_percentage + rule.profit_percentage}%, Tax: {rule.tax_percentage}%)
              </option>
            ))}
          </Select>
          <Input
            label="Quote Title"
            value={quoteData.title}
            onChange={(e) => setQuoteData({ ...quoteData, title: e.target.value })}
            placeholder="e.g., Water Damage Restoration - Kitchen"
            required
          />
          <Input
            label="Description"
            value={quoteData.description}
            onChange={(e) => setQuoteData({ ...quoteData, description: e.target.value })}
            placeholder="Additional details..."
          />
        </div>
      </Card>

      <Card
        title="Line Items"
        subtitle={`${lineItems.length} items`}
        actions={
          <Button onClick={() => setShowPriceModal(true)}>
            + Add Line Item
          </Button>
        }
      >
        <Table
          columns={lineItemColumns}
          data={lineItems}
          emptyMessage="No line items added. Click 'Add Line Item' to get started."
        />

        {lineItems.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <div className="flex justify-end">
              <div className="w-96 space-y-2">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span className="font-semibold">${totals.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Overhead & Profit:</span>
                  <span>${totals.overheadProfit}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax:</span>
                  <span>${totals.tax}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-blue-600">${totals.total}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 border-t pt-2">
                  <span>Total Labor Hours:</span>
                  <span>{totals.totalLaborHours} hrs</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="secondary"
            onClick={() => {
              setQuoteData({
                client_id: '',
                title: '',
                description: '',
                pricing_rule_id: 1
              });
              setLineItems([]);
            }}
          >
            Clear Quote
          </Button>
          <Button onClick={handleGenerateQuote} disabled={lineItems.length === 0}>
            Generate Quote
          </Button>
        </div>
      </Card>

      <Modal
        isOpen={showPriceModal}
        onClose={() => setShowPriceModal(false)}
        title="Add Line Item from Price List"
        size="xl"
      >
        <div className="mb-4 flex gap-4">
          <Input
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-48"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <Table
            columns={priceListColumns}
            data={priceList}
            emptyMessage="No items found in price list"
          />
        </div>
      </Modal>
    </div>
  );
};

export default QuoteGeneratorView;
