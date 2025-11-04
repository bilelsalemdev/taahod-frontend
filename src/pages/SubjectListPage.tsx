import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Button, Empty, Spin, Input, Modal, Form, message } from 'antd';
import { PlusOutlined, BookOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useSubjects, useCreateSubject, useDeleteSubject } from '../hooks/useSubjects';
import { useAuth } from '../contexts/AuthContext';
import type { Subject } from '../types';

const { Search } = Input;
const { TextArea } = Input;

export function SubjectListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading, error } = useSubjects();
  const createSubject = useCreateSubject();
  const deleteSubject = useDeleteSubject();

  const subjects = data?.data?.subjects || [];
  const isAdmin = user?.role === 'admin';

  const filteredSubjects = subjects.filter((subject: Subject) =>
    subject.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSubject = async (values: any) => {
    try {
      await createSubject.mutateAsync(values);
      message.success(t('library.createSuccess'));
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.messageAr || error.message || t('common.error'));
    }
  };

  const handleDeleteSubject = async (id: string) => {
    Modal.confirm({
      title: t('library.deleteSubject'),
      content: t('library.confirmDelete'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      onOk: async () => {
        try {
          await deleteSubject.mutateAsync(id);
          message.success(t('library.deleteSuccess'));
        } catch (error: any) {
          message.error(error.messageAr || error.message || t('common.error'));
        }
      },
    });
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
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>{t('library.allSubjects')}</h1>
        {isAdmin && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            {t('library.createSubject')}
          </Button>
        )}
      </div>

      <Search
        placeholder={t('common.search')}
        allowClear
        size="large"
        style={{ marginBottom: '24px' }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredSubjects.length === 0 ? (
        <Empty description={t('library.noSubjects')} />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredSubjects.map((subject: Subject) => (
            <Col xs={24} sm={12} md={8} lg={6} key={subject._id}>
              <Card
                hoverable
                onClick={() => navigate(`/subjects/${subject._id}`)}
                actions={
                  isAdmin
                    ? [
                        <EditOutlined key="edit" onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement edit
                        }} />,
                        <DeleteOutlined key="delete" onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSubject(subject._id);
                        }} />,
                      ]
                    : undefined
                }
              >
                <Card.Meta
                  avatar={<BookOutlined style={{ fontSize: '24px' }} />}
                  title={subject.nameAr}
                  description={subject.descriptionAr?.substring(0, 100) + '...'}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={t('library.createSubject')}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubject}
        >
          <Form.Item
            name="nameAr"
            label={t('library.subjectName') + ' (عربي)'}
            rules={[{ required: true, message: 'الرجاء إدخال اسم المادة' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label={t('library.subjectName') + ' (English)'}
            rules={[{ required: true, message: 'Please enter subject name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="descriptionAr"
            label={t('library.subjectDescription') + ' (عربي)'}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="description"
            label={t('library.subjectDescription') + ' (English)'}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={createSubject.isPending} block>
              {t('common.submit')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
