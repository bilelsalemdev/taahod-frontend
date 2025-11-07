import { Card, Checkbox, Row, Col, Empty, Spin, Tag } from 'antd';
import { BookOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSubjects } from '../hooks/useSubjects';
import { CornerOrnament } from './patterns';
import type { Subject } from '../types';

interface SubjectSelectorProps {
  selectedSubjectIds: string[];
  onChange: (subjectIds: string[]) => void;
}

export function SubjectSelector({ selectedSubjectIds, onChange }: SubjectSelectorProps) {
  const { t } = useTranslation();
  const { data, isLoading, error } = useSubjects();

  const subjects = data?.data?.subjects || [];

  const handleToggle = (subjectId: string) => {
    if (selectedSubjectIds.includes(subjectId)) {
      onChange(selectedSubjectIds.filter((id) => id !== subjectId));
    } else {
      onChange([...selectedSubjectIds, subjectId]);
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Empty description={(error as any).messageAr || (error as any).message || t('common.error')} />
      </div>
    );
  }

  if (subjects.length === 0) {
    return <Empty description={t('library.noSubjects')} />;
  }

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontFamily: "'Amiri', serif", color: 'var(--color-primary)' }}>
          {t('schedule.selectSubjects')}
        </h3>
        {selectedSubjectIds.length > 0 && (
          <Tag color="green" style={{ fontSize: '14px' }}>
            {selectedSubjectIds.length} {t('schedule.selectedSubjects')}
          </Tag>
        )}
      </div>

      <Row gutter={[16, 16]}>
        {subjects.map((subject: Subject) => {
          const isSelected = selectedSubjectIds.includes(subject._id);
          
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={subject._id}>
              <Card
                hoverable
                onClick={() => handleToggle(subject._id)}
                style={{
                  border: isSelected
                    ? '2px solid var(--color-primary)'
                    : '2px solid var(--color-warm-gray)',
                  backgroundColor: isSelected ? 'var(--color-bg-cream)' : 'white',
                  position: 'relative',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                {isSelected ? (
                  <>
                    <CornerOrnament position="all" color="var(--color-accent-gold)" size={20} />
                    <CheckCircleFilled
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        fontSize: '24px',
                        color: 'var(--color-primary)',
                        zIndex: 2,
                      }}
                    />
                  </>
                ) : null}
                <Card.Meta
                  avatar={
                    <BookOutlined
                      style={{
                        fontSize: '24px',
                        color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      }}
                    />
                  }
                  title={
                    <span
                      style={{
                        fontFamily: "'Amiri', serif",
                        color: isSelected ? 'var(--color-primary)' : 'var(--color-text-primary)',
                      }}
                    >
                      {subject.nameAr}
                    </span>
                  }
                  description={subject.descriptionAr?.substring(0, 60) + '...'}
                />
                <div style={{ marginTop: '12px' }}>
                  <Checkbox checked={isSelected} onChange={() => handleToggle(subject._id)}>
                    {isSelected ? 'مختار' : 'اختر'}
                  </Checkbox>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
}
