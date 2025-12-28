'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import Tabs from '@/components/Tabs';
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import { carTypesAPI, faqsAPI, CarType, FAQ } from '@/lib/api';
import { ContentTableSkeleton } from '@/components/Skeleton';

const tabs = [
  { label: 'Car Types', value: 'car-types' },
  { label: 'FAQs', value: 'faqs' },
];

export default function ContentConfiguration() {
  const [activeTab, setActiveTab] = useState('car-types');
  const [carTypes, setCarTypes] = useState<CarType[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showCarTypeModal, setShowCarTypeModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState({ question: '', answer: '' });
  const [carTypeForm, setCarTypeForm] = useState({ name: '', description: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [carTypesRes, faqsRes] = await Promise.all([
          carTypesAPI.getAll(),
          faqsAPI.getAll()
        ]);

        if (carTypesRes.success) {
          setCarTypes(carTypesRes.data.carTypes);
        }
        if (faqsRes.success) {
          setFaqs(faqsRes.data.faqs);
        }
      } catch (err) {
        console.error('Failed to fetch content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCarType = async (id: string, currentStatus: boolean) => {
    try {
      await carTypesAPI.update(id, { isActive: !currentStatus });
      setCarTypes(carTypes.map(ct =>
        ct._id === id ? { ...ct, isActive: !ct.isActive } : ct
      ));
    } catch (err) {
      console.error('Failed to toggle car type:', err);
    }
  };

  const deleteCarType = async (id: string) => {
    try {
      await carTypesAPI.delete(id);
      setCarTypes(carTypes.filter(ct => ct._id !== id));
    } catch (err) {
      console.error('Failed to delete car type:', err);
    }
  };

  const openAddCarType = () => {
    setCarTypeForm({ name: '', description: '' });
    setShowCarTypeModal(true);
  };

  const saveCarType = async () => {
    try {
      setActionLoading(true);
      const response = await carTypesAPI.create({
        name: carTypeForm.name,
        description: carTypeForm.description,
        isActive: true
      });
      if (response.success) {
        setCarTypes([...carTypes, response.data]);
        setShowCarTypeModal(false);
        setCarTypeForm({ name: '', description: '' });
      }
    } catch (err) {
      console.error('Failed to create car type:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const openAddFAQ = () => {
    setEditingFAQ(null);
    setFaqForm({ question: '', answer: '' });
    setShowFAQModal(true);
  };

  const openEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq);
    setFaqForm({ question: faq.question, answer: faq.answer });
    setShowFAQModal(true);
  };

  const saveFAQ = async () => {
    try {
      setActionLoading(true);
      if (editingFAQ) {
        const response = await faqsAPI.update(editingFAQ._id, faqForm);
        if (response.success) {
          setFaqs(faqs.map(f =>
            f._id === editingFAQ._id ? response.data : f
          ));
        }
      } else {
        const response = await faqsAPI.create(faqForm);
        if (response.success) {
          setFaqs([...faqs, response.data]);
        }
      }
      setShowFAQModal(false);
      setEditingFAQ(null);
      setFaqForm({ question: '', answer: '' });
    } catch (err) {
      console.error('Failed to save FAQ:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      await faqsAPI.delete(id);
      setFaqs(faqs.filter(f => f._id !== id));
    } catch (err) {
      console.error('Failed to delete FAQ:', err);
    }
  };

  if (loading) {
    return (
      <>
        <DashboardHeader title="Content Configuration" />
        <div className="mb-4 sm:mb-6">
          <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <ContentTableSkeleton rows={5} />
      </>
    );
  }

  return (
    <>
      <DashboardHeader title="Content Configuration" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'faqs' && (
          <Button onClick={openAddFAQ} className="w-full sm:w-auto px-4 sm:px-6">
            Add New FAQ
          </Button>
        )}
        {activeTab === 'car-types' && (
          <Button onClick={openAddCarType} className="w-full sm:w-auto px-4 sm:px-6">
            Add New Car Type
          </Button>
        )}
      </div>

      {activeTab === 'car-types' ? (
        /* Car Types Tab */
        <div className="bg-white rounded-lg overflow-x-auto -mx-4 sm:mx-0">
          {carTypes.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500 text-sm sm:text-base">No car types found</div>
            </div>
          ) : (
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 sm:py-4 px-3 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-2">
                      Car Type
                    </div>
                  </th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-500 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      Description
                    </div>
                  </th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-2">
                      Status
                    </div>
                  </th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4"></th>
                </tr>
              </thead>
              <tbody>
                {carTypes.map((carType) => (
                  <tr key={carType._id} className="border-b border-gray-100">
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-900">
                      {carType.name}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">
                      {carType.description || '-'}
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className={`text-xs sm:text-sm ${carType.isActive ? 'text-primary' : 'text-gray-400'}`}>
                          {carType.isActive ? 'Active' : 'Disabled'}
                        </span>
                        <button
                          onClick={() => toggleCarType(carType._id, carType.isActive)}
                          className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
                            carType.isActive ? 'bg-black' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
                              carType.isActive ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4">
                      <button
                        onClick={() => deleteCarType(carType._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        /* FAQs Tab */
        <div className="bg-white rounded-lg overflow-x-auto -mx-4 sm:mx-0">
          {faqs.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500 text-sm sm:text-base">No FAQs found</div>
            </div>
          ) : (
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 sm:py-4 px-3 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-500">
                    Question
                  </th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4 text-left text-xs sm:text-sm font-medium text-gray-500 hidden sm:table-cell">
                    Answer
                  </th>
                  <th className="py-3 sm:py-4 px-3 sm:px-4"></th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq) => (
                  <tr key={faq._id} className="border-b border-gray-100">
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-900 max-w-[200px] sm:max-w-xs">
                      <div className="line-clamp-2">{faq.question}</div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-xs sm:text-sm text-gray-600 max-w-md hidden sm:table-cell">
                      <div className="line-clamp-2">{faq.answer}</div>
                    </td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => deleteFAQ(faq._id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                        <button
                          onClick={() => openEditFAQ(faq)}
                          className="text-gray-400 hover:text-primary"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Car Type Modal */}
      <Modal
        isOpen={showCarTypeModal}
        onClose={() => setShowCarTypeModal(false)}
        title="Add New Car Type"
      >
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg">
            <input
              type="text"
              placeholder="Enter Name"
              value={carTypeForm.name}
              onChange={(e) => setCarTypeForm({ ...carTypeForm, name: e.target.value })}
              className="w-full px-4 py-3 focus:outline-none text-primary placeholder:text-gray-400 rounded-lg"
            />
          </div>
          <div className="border border-gray-200 rounded-lg">
            <textarea
              placeholder="Enter Description (optional)"
              value={carTypeForm.description}
              onChange={(e) => setCarTypeForm({ ...carTypeForm, description: e.target.value })}
              className="w-full px-4 py-3 focus:outline-none text-primary placeholder:text-gray-400 rounded-lg resize-none"
              rows={2}
            />
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="secondary" onClick={() => setShowCarTypeModal(false)}>
              Cancel
            </Button>
            <Button onClick={saveCarType} disabled={actionLoading || !carTypeForm.name.trim()}>
              {actionLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* FAQ Modal */}
      <Modal
        isOpen={showFAQModal}
        onClose={() => setShowFAQModal(false)}
        title={editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
      >
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg">
            <textarea
              placeholder="Enter Question"
              value={faqForm.question}
              onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
              className="w-full px-4 py-3 focus:outline-none text-primary placeholder:text-gray-400 rounded-lg resize-none"
              rows={2}
            />
          </div>
          <div className="border border-gray-200 rounded-lg">
            <textarea
              placeholder="Enter Answer"
              value={faqForm.answer}
              onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
              className="w-full px-4 py-3 focus:outline-none text-primary placeholder:text-gray-400 rounded-lg resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-4 pt-4">
            <Button variant="secondary" onClick={() => setShowFAQModal(false)}>
              Cancel
            </Button>
            <Button onClick={saveFAQ} disabled={actionLoading || !faqForm.question.trim() || !faqForm.answer.trim()}>
              {actionLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
