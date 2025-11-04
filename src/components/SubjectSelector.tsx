import { Card, Checkbox, Row, Col, Empty, Spin, Tag } from 'antd';
import { BookOutlined, CheckCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSubjects } from '../hooks/useSubjects';
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
        <h3>{t('schedule.selectSubjects')}</h3>
        {selectedSubjectIds.length > 0 && (
          <Tag color="blue">
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
                  border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                  backgroundColor: isSelected ? '#e6f7ff' : 'white',
                  position: 'relative',
                }}
              >
                {isSelected && (
                  <CheckCircleFilled
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      fontSize: '24px',
                      color: '#1890ff',
                    }}
                  />
                )}
                <Card.Meta
                  avatar={<BookOutlined style={{ fontSize: '24px' }} />}
                  title={subject.nameAr}
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
