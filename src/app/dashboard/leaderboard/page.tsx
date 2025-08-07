"use client";
import React from 'react';
import { Table, Avatar, Tag, Card, Segmented, Space, Typography, Spin } from 'antd';
import { CrownOutlined, TrophyOutlined, StarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { fetchLeaderBoardData } from '@/services/leaderboardApi';

const { Title, Text } = Typography;

const LeaderBoard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: fetchLeaderBoardData,
  });

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
        <Text type="danger">Error: {error.message}</Text>
      </div>
    );
  }

  // Transform API data to match the table format
  const studentData = data?.data?.map((student, index) => ({
    key: student.student_id.toString(),
    rank: index + 1,
    name: student.student_name,
    avatar: student.student_name?.charAt(0).toUpperCase() || '?',
    points: student.total_marks || 0,
    progress: Math.floor(Math.random() * 20) - 5, // Random progress for demo
    badge: index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : null,
  })) || [];

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
          <Avatar 
            style={{ 
              backgroundColor:
                record.badge === 'gold' ? '#FFD700' :
                record.badge === 'silver' ? '#C0C0C0' :
                record.badge === 'bronze' ? '#CD7F32' :
                '#1890ff',
              verticalAlign: 'middle',
              color: '#000',
              fontWeight: 'bold'
            }}
          >
            {record.avatar}
          </Avatar>
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
      align: 'left' as const
    },
    // {
    //   title: 'Progress',
    //   dataIndex: 'progress',
    //   key: 'progress',
    //   render: (progress: number) => (
    //     <Space>
    //       {progress > 0 ? (
    //         <>
    //           <RiseOutlined style={{ color: '#52c41a' }} />
    //           <Text type="success">{progress}%</Text>
    //         </>
    //       ) : (
    //         <>
    //           <FallOutlined style={{ color: '#f5222d' }} />
    //           <Text type="danger">{Math.abs(progress)}%</Text>
    //         </>
    //       )}
    //     </Space>
    //   ),
    //   width: 120,
    //   align: 'center' as const
    // },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={3} style={{ margin: 0 }}>Student Leaderboard</Title>
              {/* <Segmented 
                options={['Weekly', 'Monthly', 'All Time']} 
                defaultValue="Weekly"
              /> */}
            </div>

            {/* <Card bordered={false} style={{ backgroundColor: '#fafafa' }}>
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
            </Card> */}

            <Table 
              columns={columns} 
              dataSource={studentData} 
              pagination={false}
              rowClassName={(_, index) => index % 2 === 0 ? 'ant-table-row-striped' : ''}
              scroll={{ x: true }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text type="secondary">Showing top {studentData.length} of {studentData.length} students</Text>
              <Text type="secondary" style={{ cursor: 'pointer', color: '#1890ff' }}>Load More</Text>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default LeaderBoard;