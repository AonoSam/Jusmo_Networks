import { useEffect, useState } from "react";

import {
  getCompany,
  type Company,
} from "../api/company";

interface UseCompanyResult {
  company: Company | null;
  loading: boolean;
  error: string | null;
}

export function useCompany(): UseCompanyResult {
  const [company, setCompany] =
    useState<Company | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const loadCompany = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCompany();

        setCompany(data);
      } catch (err) {
        console.error(
          "Failed to load company information:",
          err
        );

        setError(
          "Unable to load company information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, []);

  return {
    company,
    loading,
    error,
  };
}
