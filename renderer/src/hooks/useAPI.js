import { useState, useCallback } from 'react';

export const useAPI = (apiClient) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getAll();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const create = useCallback(async (data) => {
    setError(null);
    try {
      await apiClient.create(data);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiClient]);

  const update = useCallback(async (id, data) => {
    setError(null);
    try {
      await apiClient.update(id, data);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiClient]);

  const remove = useCallback(async (id) => {
    setError(null);
    try {
      await apiClient.delete(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [apiClient]);

  return { items, loading, error, fetchAll, create, update, remove };
};

// Alias for backwards compatibility
export const useCRUD = useAPI;
