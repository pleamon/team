'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Check, AlertCircle, Loader2 } from 'lucide-react'
import { MerchantService, type CreateMerchantPayload } from '@/services/merchant-service'

const STEPS = [
  { id: 1, title: 'Basic Info', desc: 'Name, Email, Region' },
  { id: 2, title: 'Business Details', desc: 'Registration, Website' },
  { id: 3, title: 'Settlement', desc: 'Bank Account' },
]

export default function MerchantCreatePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [globalError, setGlobalError] = useState<string | null>(null)

  const [formData, setFormData] = useState<CreateMerchantPayload>({
    name: '',
    email: '',
    region: 'SG',
    businessType: 'enterprise',
    registrationNumber: '',
    website: '',
    bankName: '',
    accountNumber: '',
    currency: 'SGD',
  })

  const handleChange = (field: keyof CreateMerchantPayload, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for field
    if (formErrors[field]) {
      setFormErrors(prev => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {}
    if (step === 1) {
      if (formData.name.length < 2) errors.name = 'Name must be at least 2 characters'
      if (!formData.email.includes('@')) errors.email = 'Invalid email'
    }
    if (step === 2) {
      if (!formData.website.startsWith('http')) errors.website = 'URL must start with http/https'
      if (!formData.registrationNumber) errors.registrationNumber = 'Required'
    }
    // Step 3 (Bank) simple check
    if (step === 3) {
      if (!formData.bankName) errors.bankName = 'Required'
      if (!formData.accountNumber) errors.accountNumber = 'Required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(3)) return

    setIsSubmitting(true)
    setGlobalError(null)
    
    try {
      await MerchantService.create(formData)
      router.push('/merchants')
    } catch (err: any) {
      if (err.code === 'VALIDATION_ERROR' && err.details) {
        // Map backend errors
        const map: Record<string, string> = {}
        err.details.forEach((e: any) => map[e.field] = e.message)
        setFormErrors(map)
        setGlobalError('Please correct the errors below.')
      } else {
        setGlobalError('Failed to create merchant. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      <Link href="/merchants" className="inline-flex items-center text-sm text-text-muted hover:text-text mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" /> Back to Merchants
      </Link>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-text">Onboard New Merchant</h1>
        <p className="text-text-muted">Complete the 3-step wizard to register a new merchant.</p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between relative mb-8 mt-6">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
        {STEPS.map((step) => {
          const isCompleted = step.id < currentStep
          const isCurrent = step.id === currentStep
          return (
            <div key={step.id} className="flex flex-col items-center bg-white px-2">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors
                  ${isCompleted ? 'bg-primary-600 border-primary-600 text-white' : 
                    isCurrent ? 'bg-white border-primary-600 text-primary-600' : 
                    'bg-white border-gray-300 text-gray-400'}`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-primary-700' : 'text-text-muted'}`}>
                {step.title}
              </span>
            </div>
          )
        })}
      </div>

      {/* Global Error Banner */}
      {globalError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-medium">{globalError}</p>
        </div>
      )}

      {/* Form Content */}
      <div className="bg-surface rounded-xl border border-border p-6 shadow-sm">
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField 
                label="Merchant Name" 
                value={formData.name} 
                onChange={v => handleChange('name', v)} 
                error={formErrors.name} 
                placeholder="e.g. Acme Corp"
              />
              <InputField 
                label="Region" 
                value={formData.region} 
                onChange={v => handleChange('region', v)} 
                error={formErrors.region}
                type="select"
                options={['SG', 'ID', 'MY', 'TH', 'VN', 'PH']}
              />
              <div className="col-span-2">
                <InputField 
                  label="Email Address" 
                  value={formData.email} 
                  onChange={v => handleChange('email', v)} 
                  error={formErrors.email}
                  placeholder="contact@example.com"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold mb-4">Business Details</h3>
            <div className="space-y-4">
               <InputField 
                label="Business Type" 
                value={formData.businessType} 
                onChange={v => handleChange('businessType', v)} 
                type="select"
                options={['enterprise', 'individual']}
              />
              <InputField 
                label="Registration Number" 
                value={formData.registrationNumber} 
                onChange={v => handleChange('registrationNumber', v)} 
                error={formErrors.registrationNumber} 
                placeholder="UEN / Tax ID"
              />
              <InputField 
                label="Website URL" 
                value={formData.website} 
                onChange={v => handleChange('website', v)} 
                error={formErrors.website} 
                placeholder="https://..."
              />
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold mb-4">Settlement Configuration</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField 
                  label="Bank Name" 
                  value={formData.bankName} 
                  onChange={v => handleChange('bankName', v)} 
                  error={formErrors.bankName} 
                />
                 <InputField 
                  label="Currency" 
                  value={formData.currency} 
                  onChange={v => handleChange('currency', v)} 
                  type="select"
                  options={['SGD', 'USD', 'IDR', 'MYR']}
                />
              </div>
              <InputField 
                label="Account Number" 
                value={formData.accountNumber} 
                onChange={v => handleChange('accountNumber', v)} 
                error={formErrors.accountNumber} 
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-between pt-4 border-t border-border">
          <button 
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1 || isSubmitting}
            className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text disabled:opacity-50"
          >
            Back
          </button>
          
          {currentStep < 3 ? (
            <button 
              onClick={handleNext}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Continue
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Complete Onboarding
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function InputField({ label, value, onChange, error, type = 'text', options, placeholder }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text">{label}</label>
      {type === 'select' ? (
        <select 
          value={value} 
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        >
          {options?.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input 
          type={type} 
          value={value} 
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 transition-all
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
              : 'border-border focus:border-primary-500 focus:ring-primary-100'}`}
        />
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
