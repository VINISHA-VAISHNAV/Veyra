import React from 'react';
import { CheckCircle2, Clock, Truck, PackageCheck, XCircle } from 'lucide-react';

const STEPS = [
  { key: 'Placed', label: 'Placed', icon: Clock },
  { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: PackageCheck },
];

export default function OrderTimeline({ status }) {
  if (status === 'Cancelled') {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.85rem 1.15rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: 'var(--radius-sm)',
          color: '#b91c1c',
          fontSize: '0.875rem',
          fontWeight: 600,
        }}
      >
        <XCircle size={18} />
        <span>Order Cancelled — All items and inventory holds have been released.</span>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.key === status);
  // Default to 0 if unrecognized or 'Placed'
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div style={{ width: '100%', padding: '1rem 0' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Background connector line */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '24px',
            right: '24px',
            height: '2px',
            backgroundColor: 'var(--border-light)',
            zIndex: 1,
          }}
        />

        {/* Active connector line */}
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '24px',
            width: `${(activeIndex / (STEPS.length - 1)) * 92}%`,
            height: '2px',
            backgroundColor: '#09090b',
            transition: 'width 0.4s ease',
            zIndex: 2,
          }}
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const StepIcon = step.icon;

          return (
            <div
              key={step.key}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                position: 'relative',
                zIndex: 3,
                minWidth: '70px',
              }}
            >
              {/* Circle Icon Indicator */}
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isCompleted || isCurrent ? '#09090b' : '#f4f4f5',
                  color: isCompleted || isCurrent ? '#ffffff' : '#a1a1aa',
                  border: isCurrent
                    ? '3px solid #e4e4e7'
                    : isCompleted
                    ? 'none'
                    : '1px solid var(--border-light)',
                  boxShadow: isCurrent ? '0 0 0 2px #09090b' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                <StepIcon size={14} />
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: isCurrent ? 700 : isCompleted ? 600 : 500,
                  color: isCurrent
                    ? 'var(--text-primary)'
                    : isCompleted
                    ? 'var(--text-secondary)'
                    : 'var(--text-muted)',
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
