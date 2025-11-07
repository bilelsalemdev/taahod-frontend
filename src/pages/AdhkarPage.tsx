import { useState } from 'react';
import { Card, Empty, Spin, Select, Collapse, Tag, Space, Typography } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAdhkar, useAdhkarByCategory } from '../hooks/useAdhkar';
import { IslamicPattern, CornerOrnament } from '../components/patterns';
import type { Adhkar } from '../types';

const { Panel } = Collapse;
const { Title, Paragraph, Text } = Typography;

const CATEGORIES = [
  { value: 'all', labelEn: 'All Categories', labelAr: 'جميع الفئات' },
  { value: 'morning', labelEn: 'Morning', labelAr: 'أذكار الصباح' },
  { value: 'evening', labelEn: 'Evening', labelAr: 'أذكار المساء' },
  { value: 'after-prayer', labelEn: 'After Prayer', labelAr: 'أذكار بعد الصلاة' },
  { value: 'sleeping', labelEn: 'Before Sleeping', labelAr: 'أذكار النوم' },
  { value: 'general', labelEn: 'General', labelAr: 'عامة' },
];

export function AdhkarPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: allData, isLoading: allLoading } = useAdhkar();
  const { data: categoryData, isLoading: categoryLoading } = useAdhkarByCategory(
    selectedCategory !== 'all' ? selectedCategory : ''
  );

  const isLoading = selectedCategory === 'all' ? allLoading : categoryLoading;
  const data = selectedCategory === 'all' ? allData : categoryData;
  const adhkar = data?.data?.adhkar || [];

  const getCategoryLabel = (category: string) => {
    const cat = CATEGORIES.find((c) => c.value === category);
    return cat?.labelAr || category;
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header Section */}
      <div
        style={{
          marginBottom: '32px',
          padding: '32px',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)',
          borderRadius: '16px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <IslamicPattern type="star" opacity={0.1} color="#d97706" />
        <CornerOrnament position="all" color="rgba(217, 119, 6, 0.5)" size={35} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <BookOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
          <Title
            level={1}
            style={{
              color: 'white',
              fontFamily: "'Amiri', serif",
              fontSize: '36px',
              margin: 0,
            }}
          >
            {t('adhkar.dailyAdhkar')}
          </Title>
          <div
            style={{
              height: '2px',
              width: '100px',
              background: 'linear-gradient(90deg, transparent, #d97706, transparent)',
              margin: '16px auto',
            }}
          />
          <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>
            الأذكار والأدعية المأثورة من الكتاب والسنة
          </Text>
        </div>
      </div>

      {/* Filter Card */}
      <Card
        style={{
          marginBottom: '24px',
          borderRadius: '12px',
          border: '2px solid var(--color-accent-gold)',
          position: 'relative',
        }}
      >
        <CornerOrnament position="top-right" color="var(--color-accent-gold)" size={25} />
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong style={{ fontSize: '16px', color: 'var(--color-primary)' }}>
            {t('adhkar.filterByCategory')}
          </Text>
          <Select
            value={selectedCategory}
            onChange={setSelectedCategory}
            style={{ width: '100%', maxWidth: '400px' }}
            size="large"
          >
            {CATEGORIES.map((cat) => (
              <Select.Option key={cat.value} value={cat.value}>
                {cat.labelAr}
              </Select.Option>
            ))}
          </Select>
        </Space>
      </Card>

      {adhkar.length === 0 ? (
        <Empty description={t('adhkar.noAdhkar')} />
      ) : (
        <Collapse accordion>
          {adhkar.map((dhikr: Adhkar, index: number) => (
            <Panel
              header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold' }}>
                    {index + 1}. {dhikr.titleAr}
                  </span>
                  <Space>
                    <Tag color="blue">{getCategoryLabel(dhikr.category)}</Tag>
                    {dhikr.repetitions > 1 && (
                      <Tag color="green">
                        {dhikr.repetitions}x {t('adhkar.repetitions')}
                      </Tag>
                    )}
                  </Space>
                </div>
              }
              key={dhikr._id}
            >
              <Card>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  {/* Arabic Text */}
                  <div style={{ position: 'relative' }}>
                    <Text
                      strong
                      style={{
                        display: 'block',
                        marginBottom: '12px',
                        color: 'var(--color-primary)',
                        fontSize: '16px',
                      }}
                    >
                      {t('adhkar.arabicText')}:
                    </Text>
                    <div
                      style={{
                        position: 'relative',
                        background: 'var(--color-bg-cream)',
                        padding: '24px',
                        borderRadius: '12px',
                        border: '2px solid var(--color-accent-gold)',
                        overflow: 'hidden',
                      }}
                    >
                      <IslamicPattern type="arabesque" opacity={0.03} color="var(--color-primary)" />
                      <Paragraph
                        style={{
                          fontSize: '28px',
                          lineHeight: '2.2',
                          textAlign: 'center',
                          direction: 'rtl',
                          fontFamily: "'Amiri', 'Scheherazade New', serif",
                          color: 'var(--color-text-primary)',
                          margin: 0,
                          position: 'relative',
                          zIndex: 1,
                        }}
                      >
                        {dhikr.textAr}
                      </Paragraph>
                    </div>
                  </div>

                  {/* Transliteration */}
                  {dhikr.transliteration && (
                    <div>
                      <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                        {t('adhkar.transliteration')}:
                      </Text>
                      <Paragraph
                        style={{
                          fontSize: '16px',
                          fontStyle: 'italic',
                          backgroundColor: '#f0f0f0',
                          padding: '12px',
                          borderRadius: '8px',
                        }}
                      >
                        {dhikr.transliteration}
                      </Paragraph>
                    </div>
                  )}

                  {/* Translation */}
                  {dhikr.translation && (
                    <div>
                      <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                        {t('adhkar.translation')}:
                      </Text>
                      <Paragraph
                        style={{
                          fontSize: '16px',
                          backgroundColor: '#e6f7ff',
                          padding: '12px',
                          borderRadius: '8px',
                        }}
                      >
                        {dhikr.translation}
                      </Paragraph>
                    </div>
                  )}

                  {/* Source */}
                  {dhikr.source && (
                    <div>
                      <Text type="secondary">
                        <strong>{t('adhkar.source')}:</strong> {dhikr.source}
                      </Text>
                    </div>
                  )}

                  {/* Time of Day */}
                  {dhikr.timeOfDay && (
                    <div>
                      <Tag color="purple">{dhikr.timeOfDay}</Tag>
                    </div>
                  )}
                </Space>
              </Card>
            </Panel>
          ))}
        </Collapse>
      )}
    </div>
  );
}
