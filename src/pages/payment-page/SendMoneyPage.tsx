import React, { useState, useMemo, useEffect } from 'react';
import { FormErrors, FormValues, TransactionStatus } from '../../types/inputFormFields';
import { validateForm } from '../../utils/validateFormFields';
import { useExchangeRates } from '../../hooks/useExchangeRates';
import { COUNTRIES, CountryCode } from '../../types/country';
import { concatReceivedAmount, convertUsdToLocal } from '../../utils/validateCurrency';
import TransactionBanner from '../../components/TransactionBanner/TransactionBanner';
import NameInput from '../../components/NameInput/NameInput';
import CountrySelect from '../../components/CountrySelect/CountrySelectInput';
import PhoneNumberInput from '../../components/PhoneNumberInput/PhoneNumberInput';
import ReceivedAmount from '../../components/ReceivedAmount/ReceivedAmount';
import SendButton from '../../components/SendButton/SendButton';
import AmountToSendInput from '../../components/AmountToSendInput/AmountToSendInput';

const INITIAL_VALUES: FormValues = {
  firstName: '',
  lastName: '',
  countryCode: '',
  phone: '',
  amountUsd: '',
};

const SendMoneyForm: React.FC = () => {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [status, setStatus] = useState<TransactionStatus>('idle');

  const { rates, loading: ratesLoading, error: ratesError } = useExchangeRates();

  // Helper to update form values and re-validate the form on change, but only for fields that have been touched
  const setField = <K extends keyof FormValues>(field: K, value: FormValues[K]) => {
    setValues((prev) => {
      const next = { ...prev, [field]: value };
      // Re-validate only touched fields
      if (touched[field]) {
        setErrors(validateForm(next));
      }
      return next;
    });
  };

  // Mark a field as touched and validate it on blur
  const handleBlur = (field: keyof FormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors(validateForm(values));
  };

  // Calculate the received amount in local currency based on the entered USD amount and selected country
  const receivedAmount = useMemo((): string | null => {
    if (!values.countryCode || !values.amountUsd || !rates) return null;
    const amount = parseInt(values.amountUsd, 10);
    if (isNaN(amount) || amount <= 0) return null;
    const country = COUNTRIES[values.countryCode as CountryCode];
    const rate = rates[country.currency];
    if (rate === undefined) return null;
    const converted = convertUsdToLocal(amount, rate);
    return concatReceivedAmount(converted, country.currency);
  }, [values.countryCode, values.amountUsd, rates]);

  // Handle form submission
  const handleSend = () => {
    // Mark all fields as touched to show validation errors for any untouched fields before submission
    const allTouched: Partial<Record<keyof FormValues, boolean>> = {
      firstName: true,
      lastName: true,
      countryCode: true,
      phone: true,
      amountUsd: true,
    };
    setTouched(allTouched);
    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setStatus('sending');
    // Simulate sending request,  in a real app this would be an API call
    setTimeout(() => setStatus('sent'), 1500);
  };

  // refresh the form after showing the success message for a few seconds
  useEffect(() => {
    if (status === 'sent') {
      setTimeout(() => {
    setStatus('idle')
    setValues(INITIAL_VALUES);
    setTouched({});
    }, 3000);
      }
  }, [status]);

  const recipientName = [values.firstName.trim(), values.lastName.trim()]
    .filter(Boolean)
    .join(' ');

  const isFormDisabled = status !== 'idle';

  return (
    <main className="screen">
      <h1 className="screen__title">PenguinPay - Transaction form</h1>

      <TransactionBanner status={status} recipientName={recipientName} />

      <form
        className="send-form"
        noValidate
        onSubmit={(e) => e.preventDefault()}
        aria-label="Send transaction form"
      >
        <NameInput
          id="firstName"
          label="Recipient First Name"
          value={values.firstName}
          error={touched.firstName ? errors.firstName : undefined}
          onChange={(v) => setField('firstName', v)}
          onBlur={() => handleBlur('firstName')}
          disabled={isFormDisabled}
        />

        <NameInput
          id="lastName"
          label="Recipient Last Name"
          value={values.lastName}
          error={touched.lastName ? errors.lastName : undefined}
          onChange={(v) => setField('lastName', v)}
          onBlur={() => handleBlur('lastName')}
          disabled={isFormDisabled}
        />

        <CountrySelect
          value={values.countryCode}
          error={touched.countryCode ? errors.countryCode : undefined}
          onChange={(v) => {
            setField('countryCode', v);
            setField('phone', '');
          }}
          onBlur={() => handleBlur('countryCode')}
          disabled={isFormDisabled}
        />

        <PhoneNumberInput
          value={values.phone}
          countryCode={values.countryCode}
          error={touched.phone ? errors.phone : undefined}
          onChange={(v) => setField('phone', v)}
          onBlur={() => handleBlur('phone')}
          disabled={isFormDisabled}
        />

        <AmountToSendInput
          value={values.amountUsd}
          error={touched.amountUsd ? errors.amountUsd : undefined}
          onChange={(v) => setField('amountUsd', v)}
          onBlur={() => handleBlur('amountUsd')}
          disabled={isFormDisabled}
        />

        <ReceivedAmount
          formattedAmount={receivedAmount}
          loading={ratesLoading}
          error={ratesError}
        />

        <SendButton
          status={status}
          disabled={ratesLoading || !!ratesError}
          onClick={handleSend}
        />
      </form>
    </main>
  );
};

export default SendMoneyForm;
