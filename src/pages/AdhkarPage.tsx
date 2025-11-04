import { useState } from 'react';
import { Card, Empty, Spin, Select, Collapse, Tag, Space, Typography } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAdhkar, useAdhkarByCategory } from '../hooks/useAdhkar';
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
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <Title level={1}>
          <BookOutlined /> {t('adhkar.dailyAdhkar')}
        </Title>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Text strong>{t('adhkar.filterByCategory')}</Text>
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
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                      {t('adhkar.arabicText')}:
                    </Text>
                    <Paragraph
                      style={{
                        fontSize: '24px',
                        lineHeight: '2',
                        textAlign: 'right',
                        direction: 'rtl',
                        fontFamily: 'Traditional Arabic, Arial',
                        backgroundColor: '#f9f9f9',
                        padding: '16px',
                        borderRadius: '8px',
                      }}
                    >
                      {dhikr.textAr}
                    </Paragraph>
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
