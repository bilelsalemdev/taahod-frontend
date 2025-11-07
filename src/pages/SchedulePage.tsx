import { useState } from 'react';
import {
  Card,
  Button,
  Empty,
  Spin,
  Modal,
  Form,
  InputNumber,
  TimePicker,
  Checkbox,
  Switch,
  message,
  Table,
  Tag,
  Space,
  Tabs,
} from 'antd';
import { PlusOutlined, CalendarOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useSchedule, useGenerateSchedule, useDeleteSchedule } from '../hooks/useSchedule';
import { SubjectSelector } from '../components/SubjectSelector';

import type { Schedule, Subject } from '../types';

const DAYS_OF_WEEK = [
  { value: 0, labelEn: 'Sunday', labelAr: 'الأحد' },
  { value: 1, labelEn: 'Monday', labelAr: 'الإثنين' },
  { value: 2, labelEn: 'Tuesday', labelAr: 'الثلاثاء' },
  { value: 3, labelEn: 'Wednesday', labelAr: 'الأربعاء' },
  { value: 4, labelEn: 'Thursday', labelAr: 'الخميس' },
  { value: 5, labelEn: 'Friday', labelAr: 'الجمعة' },
  { value: 6, labelEn: 'Saturday', labelAr: 'السبت' },
];

export function SchedulePage() {
  const { t } = useTranslation();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [form] = Form.useForm();

  const { data, isLoading, error } = useSchedule();
  const generateSchedule = useGenerateSchedule();
  const deleteSchedule = useDeleteSchedule();

  const schedule = data?.data?.schedule || [];
  const scheduleByDay = data?.data?.scheduleByDay || {};

  const handleGenerateSchedule = async (values: any) => {
    if (selectedSubjectIds.length === 0) {
      message.error('Please select at least one subject');
      return;
    }

    try {
      await generateSchedule.mutateAsync({
        subjectIds: selectedSubjectIds,
        dailyStudyHours: values.dailyStudyHours || 2,
        preferredStartTime: values.preferredStartTime
          ? dayjs(values.preferredStartTime).format('HH:mm')
          : '09:00',
        daysPerWeek: values.daysPerWeek || [0, 1, 2, 3, 4],
        replaceExisting: values.replaceExisting || false,
      });
      message.success(t('schedule.generateSuccess'));
      setIsGenerateModalOpen(false);
      form.resetFields();
      setSelectedSubjectIds([]);
    } catch (error: any) {
      message.error(error.messageAr || error.message || t('common.error'));
    }
  };

  const handleDeleteEntry = async (id: string) => {
    Modal.confirm({
      title: t('common.delete'),
      content: t('library.confirmDelete'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deleteSchedule.mutateAsync(id);
          message.success(t('schedule.deleteSuccess'));
        } catch (error: any) {
          message.error(error.messageAr || error.message || t('common.error'));
        }
      },
    });
  };

  const renderWeeklyView = () => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {DAYS_OF_WEEK.map((day) => {
          const daySchedule = scheduleByDay[day.value] || [];
          
          return (
            <Card
              key={day.value}
              title={
                <span style={{ fontFamily: "'Amiri', serif", color: 'var(--color-primary)' }}>
                  {day.labelAr}
                </span>
              }
              size="small"
              style={{
                minHeight: '300px',
                borderRadius: '12px',
                border: '2px solid var(--color-accent-gold)',
                position: 'relative',
              }}
            >
              {daySchedule.length === 0 ? (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={t('schedule.noEntriesForDay')}
                />
              ) : (
                <Space direction="vertical" style={{ width: '100%' }}>
                  {daySchedule.map((entry: Schedule) => {
                    const subject = entry.subjectId as Subject;
                    return (
                      <Card
                        key={entry._id}
                        size="small"
                        style={{
                          background: 'var(--color-bg-cream)',
                          border: '1px solid var(--color-primary)',
                          borderRadius: '8px',
                        }}
                        actions={[
                          <DeleteOutlined
                            key="delete"
                            onClick={() => handleDeleteEntry(entry._id)}
                            style={{ color: 'var(--color-error)' }}
                          />,
                        ]}
                      >
                        <div style={{ fontSize: '12px' }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            {subject.nameAr}
                          </div>
                          <div>{entry.startTime} - {entry.endTime}</div>
                          <Tag color="blue" style={{ marginTop: '4px' }}>
                            {entry.duration} {t('schedule.minutes')}
                          </Tag>
                        </div>
                      </Card>
                    );
                  })}
                </Space>
              )}
            </Card>
          );
        })}
      </div>
    );
  };

  const renderListView = () => {
    const columns = [
      {
        title: t('schedule.studyDays'),
        dataIndex: 'dayOfWeek',
        key: 'dayOfWeek',
        render: (day: number) => DAYS_OF_WEEK[day].labelAr,
      },
      {
        title: t('library.subjectName'),
        dataIndex: 'subjectId',
        key: 'subject',
        render: (subject: Subject) => subject.nameAr,
      },
      {
        title: t('schedule.startTime'),
        dataIndex: 'startTime',
        key: 'startTime',
      },
      {
        title: t('schedule.endTime'),
        dataIndex: 'endTime',
        key: 'endTime',
      },
      {
        title: t('schedule.duration'),
        dataIndex: 'duration',
        key: 'duration',
        render: (duration: number) => `${duration} ${t('schedule.minutes')}`,
      },
      {
        title: t('common.edit'),
        key: 'actions',
        render: (_: any, record: Schedule) => (
          <Space>
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteEntry(record._id)}
              danger
            />
          </Space>
        ),
      },
    ];

    return <Table dataSource={schedule} columns={columns} rowKey="_id" />;
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

  return (
    <div>
      <div
        style={{
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <h1
          style={{
            fontFamily: "'Amiri', serif",
            color: 'var(--color-primary)',
            fontSize: '32px',
            margin: 0,
          }}
        >
          <CalendarOutlined /> {t('schedule.mySchedule')}
        </h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsGenerateModalOpen(true)}
          size="large"
        >
          {t('schedule.generateSchedule')}
        </Button>
      </div>
      <div
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent-gold), var(--color-primary))',
          marginBottom: '24px',
        }}
      />

      {schedule.length === 0 ? (
        <Empty
          description={t('schedule.noSchedule')}
          image={<CalendarOutlined style={{ fontSize: '64px', color: '#d9d9d9' }} />}
        >
          <Button type="primary" onClick={() => setIsGenerateModalOpen(true)}>
            {t('schedule.generateSchedule')}
          </Button>
        </Empty>
      ) : (
        <Tabs
          items={[
            {
              key: 'weekly',
              label: t('schedule.weeklyView'),
              children: renderWeeklyView(),
            },
            {
              key: 'list',
              label: 'List View',
              children: renderListView(),
            },
          ]}
        />
      )}

      <Modal
        title={t('schedule.generateSchedule')}
        open={isGenerateModalOpen}
        onCancel={() => {
          setIsGenerateModalOpen(false);
          form.resetFields();
          setSelectedSubjectIds([]);
        }}
        footer={null}
        width={900}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleGenerateSchedule}
          initialValues={{
            dailyStudyHours: 2,
            preferredStartTime: dayjs('09:00', 'HH:mm'),
            daysPerWeek: [0, 1, 2, 3, 4],
            replaceExisting: false,
          }}
        >
          <SubjectSelector
            selectedSubjectIds={selectedSubjectIds}
            onChange={setSelectedSubjectIds}
          />

          <Form.Item
            name="dailyStudyHours"
            label={t('schedule.dailyStudyHours')}
            style={{ marginTop: '24px' }}
          >
            <InputNumber min={1} max={12} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="preferredStartTime" label={t('schedule.preferredStartTime')}>
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="daysPerWeek" label={t('schedule.studyDays')}>
            <Checkbox.Group>
              <Space direction="vertical">
                {DAYS_OF_WEEK.map((day) => (
                  <Checkbox key={day.value} value={day.value}>
                    {day.labelAr}
                  </Checkbox>
                ))}
              </Space>
            </Checkbox.Group>
          </Form.Item>

          <Form.Item name="replaceExisting" valuePropName="checked">
            <Switch /> {t('schedule.replaceExisting')}
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={generateSchedule.isPending}
              block
            >
              {t('schedule.generateSchedule')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
