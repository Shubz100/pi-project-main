'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'

export default function SummaryPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editableFields, setEditableFields] = useState({
    piAmount: false,
    paymentAddress: false,
    PiAddress: false
  })
  const [editedValues, setEditedValues] = useState({
    piAmount: '',
    paymentAddress: '',
    PiAddress: ''
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()

      const initDataUnsafe = tg.initDataUnsafe || {}

      if (initDataUnsafe.user) {
        fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(initDataUnsafe.user),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error)
            } else {
              setUser(data)
              // Initialize edited values with current user data
              setEditedValues({
                piAmount: data.piAmount[data.piAmount.length - 1]?.toString() || '',
                paymentAddress: data.paymentAddress || '',
                PiAddress: data.PiAddress || ''
              })
            }
          })
          .catch((err) => {
            setError('Failed to fetch user data')
          })
          .finally(() => {
            setLoading(false)
          })
      }
    }
  }, [])

  const handleEdit = (field: keyof typeof editableFields) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: true
    }))
  }

  const handleSave = async (field: keyof typeof editableFields) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: false
    }))

    // Update local user state
    setUser(prev => ({
      ...prev,
      [field]: field === 'piAmount' 
        ? [...prev.piAmount.slice(0, -1), Number(editedValues.piAmount)]
        : editedValues[field]
    }))
  }

  const handleContinue = async () => {
    try {
      const response = await fetch('/api/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: user.telegramId,
          piAmount: user.piAmount,
          paymentAddress: user.paymentAddress,
          PiAddress: user.PiAddress
        }),
      })

      if (!response.ok) throw new Error('Failed to update user data')
      
      router.push('/finalpage')
    } catch (err) {
      setError('Failed to update user data')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-screen">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500 flex items-center justify-center h-screen">
        {error}
      </div>
    )
  }

  if (!user) return null

  const latestPiAmount = user.piAmount[user.piAmount.length - 1] || 0
  const amountToReceive = latestPiAmount * 0.65

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <Script src="https://kit.fontawesome.com/18e66d329f.js" />
      
      <div className="w-full custom-purple text-white p-4 flex items-center justify-between shadow-lg">
        <div></div>
        <h1 className="text-2xl font-bold">Pi Trader Official</h1>
        <div></div>
      </div>

      <div className="container mx-auto p-4 mt-8">
        <h2 className="text-3xl font-bold text-center custom-purple-text mb-8">Transaction Summary</h2>
        
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Amount of Pi Sold:</span>
              {editableFields.piAmount ? (
                <div className="flex items-center">
                  <input
                    type="number"
                    value={editedValues.piAmount}
                    onChange={(e) => setEditedValues(prev => ({ ...prev, piAmount: e.target.value }))}
                    className="border rounded px-2 py-1 w-24"
                  />
                  <button
                    onClick={() => handleSave('piAmount')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <i className="fas fa-check"></i>
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <span>{latestPiAmount} Pi</span>
                  <button
                    onClick={() => handleEdit('piAmount')}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Amount to be Received:</span>
              <span>${amountToReceive.toFixed(2)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Payment Receiving Method:</span>
              <span>{user.paymentMethod}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Payment Receiving Address:</span>
              {editableFields.paymentAddress ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={editedValues.paymentAddress}
                    onChange={(e) => setEditedValues(prev => ({ ...prev, paymentAddress: e.target.value }))}
                    className="border rounded px-2 py-1 w-48"
                  />
                  <button
                    onClick={() => handleSave('paymentAddress')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <i className="fas fa-check"></i>
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <span>{user.paymentAddress}</span>
                  <button
                    onClick={() => handleEdit('paymentAddress')}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Pi Wallet Address:</span>
              {editableFields.PiAddress ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={editedValues.PiAddress}
                    onChange={(e) => setEditedValues(prev => ({ ...prev, PiAddress: e.target.value }))}
                    className="border rounded px-2 py-1 w-48"
                  />
                  <button
                    onClick={() => handleSave('PiAddress')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <i className="fas fa-check"></i>
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <span>{user.PiAddress}</span>
                  <button
                    onClick={() => handleEdit('PiAddress')}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleContinue}
            className="w-full custom-purple text-white text-xl font-bold py-3 px-6 rounded-full mt-8 shadow-lg hover-scale"
          >
            Continue
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-purple {
          background-color: #670773;
        }
        .custom-purple-text {
          color: #670773;
        }
        .loading-spinner {
          border: 4px solid rgba(103, 7, 115, 0.1);
          border-left-color: #670773;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        .hover-scale {
          transition: transform 0.2s ease-out;
        }
        .hover-scale:hover {
          transform: scale(1.05);
        }
        .hover-scale:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  )
}
