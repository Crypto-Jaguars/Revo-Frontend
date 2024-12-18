'use client';

import { ClaimEscrowForm } from '@/components/shared/ClaimEscrowForm';
import { useClaimEscrowEarningsHook } from './hooks/claim-escrow-earnings.hook';
import { useTranslations } from 'next-intl';

type TranslationKeys = 
  | 'title'
  | 'subtitle'
  | 'submitButtonText'
  | 'fields.contractId.label'
  | 'fields.contractId.placeholder'
  | 'fields.contractId.description'
  | 'fields.engagementId.label'
  | 'fields.engagementId.placeholder';

export function ClaimEscrowEarningsForm() {
  const { form, onSubmit } = useClaimEscrowEarningsHook();
  const t = useTranslations<TranslationKeys>('ClaimEscrowEarningsForm');

  const fields = [
    {
      name: 'contractId',
      label: t('fields.contractId.label'),
      placeholder: t('fields.contractId.placeholder'),
      description: t('fields.contractId.description'),
    },
    {
      name: 'engagementId',
      label: t('fields.engagementId.label'),
      placeholder: t('fields.engagementId.placeholder'),
    },
  ];

  return (
    <ClaimEscrowForm
      title={t('title')}
      subtitle={t('subtitle')}
      fields={fields}
      form={form}
      onSubmit={onSubmit}
      submitButtonText={t('submitButtonText')}
    />
  );
}