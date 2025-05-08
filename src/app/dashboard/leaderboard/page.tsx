"use client";
import React from 'react';
import { Table, Avatar, Tag, Card, Segmented, Space, Typography } from 'antd';
import { CrownOutlined, TrophyOutlined, StarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const LeaderBoard = () => {
  const studentData = [
    {
      key: '1',
      rank: 1,
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      points: 985,
      progress: 12,
      badge: 'gold'
    },
    {
      key: '2',
      rank: 2,
      name: 'Sarah Williams',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      points: 932,
      progress: 8,
      badge: 'silver'
    },
    {
      key: '3',
      rank: 3,
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      points: 910,
      progress: 15,
      badge: 'bronze'
    },
    {
      key: '4',
      rank: 4,
      name: 'Emily Davis',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      points: 875,
      progress: -3,
      badge: null
    },
    {
      key: '5',
      rank: 5,
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      points: 842,
      progress: 5,
      badge: null
    },
  ];

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank: number) => {
        if (rank === 1) return <CrownOutlined style={{ color: '#FFD700', fontSize: 20 }} />;
        if (rank === 2) return <TrophyOutlined style={{ color: '#C0C0C0', fontSize: 20 }} />;
        if (rank === 3) return <StarOutlined style={{ color: '#CD7F32', fontSize: 20 }} />;
        return <Text>{rank}</Text>;
      },
      width: 80,
      align: 'center' as const
    },
    {
      title: 'Student',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Avatar src={record.avatar} />
          <Text strong>{text}</Text>
          {record.badge === 'gold' && <Tag color="gold">Top</Tag>}
          {record.badge === 'silver' && <Tag color="silver">Excellent</Tag>}
          {record.badge === 'bronze' && <Tag color="#cd7f32">Great</Tag>}
        </Space>
      ),
      width: 250,
      ellipsis: true
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
      render: (points: number) => <Text strong style={{ color: '#1890ff' }}>{points}</Text>,
      width: 120,
      align: 'right' as const
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Space>
          {progress > 0 ? (
            <>
              <RiseOutlined style={{ color: '#52c41a' }} />
              <Text type="success">{progress}%</Text>
            </>
          ) : (
            <>
              <FallOutlined style={{ color: '#f5222d' }} />
              <Text type="danger">{Math.abs(progress)}%</Text>
            </>
          )}
        </Space>
      ),
      width: 120,
      align: 'center' as const
    },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3} style={{ margin: 0 }}>Student Leaderboard</Title>
              <Segmented 
                options={['Weekly', 'Monthly', 'All Time']} 
                defaultValue="Weekly"
              />
            </div>

            <Card bordered={false} style={{ backgroundColor: '#fafafa' }}>
              <Space>
                <Avatar 
                  size={48} 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  style={{ border: '2px solid #faad14' }}
                />
                <Space direction="vertical" size={0}>
                  <Text strong>Your Position</Text>
                  <Text type="secondary">Rank #8 with 720 points</Text>
                </Space>
              </Space>
            </Card>

            <Table 
              columns={columns} 
              dataSource={studentData} 
              pagination={false}
              rowClassName={(_, index) => index % 2 === 0 ? 'ant-table-row-striped' : ''}
              scroll={{ x: true }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary">Showing top 5 of 128 students</Text>
              <Text type="secondary" style={{ cursor: 'pointer', color: '#1890ff' }}>Load More</Text>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default LeaderBoard;