import React, { useState } from "react";

const useForm = <T>(defaultValues: T) => {
  const [values, setValues] = useState<T>(defaultValues);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return { values, handleInputChange, setValues };
};

export default useForm;
