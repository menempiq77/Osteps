"use client";
import React from 'react';
import { Table, Avatar, Tag } from 'antd';
import { CrownOutlined, TrophyOutlined, StarOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';

const LeaderBoard = () => {
  // Sample data for the leaderboard
  const studentData = [
    {
      key: '1',
      rank: 1,
      name: 'Alex Johnson',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      points: 985,
      progress: 12,
      subjects: ['Math', 'Science', 'English'],
      badge: 'gold'
    },
    {
      key: '2',
      rank: 2,
      name: 'Sarah Williams',
      avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      points: 932,
      progress: 8,
      subjects: ['History', 'Art', 'English'],
      badge: 'silver'
    },
    {
      key: '3',
      rank: 3,
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      points: 910,
      progress: 15,
      subjects: ['Math', 'Physics', 'Chemistry'],
      badge: 'bronze'
    },
    {
      key: '4',
      rank: 4,
      name: 'Emily Davis',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      points: 875,
      progress: -3,
      subjects: ['Biology', 'Geography', 'Literature'],
      badge: null
    },
    {
      key: '5',
      rank: 5,
      name: 'David Kim',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      points: 842,
      progress: 5,
      subjects: ['Computer Science', 'Math', 'Economics'],
      badge: null
    },
  ];

  const columns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank) => {
        if (rank === 1) {
          return <CrownOutlined style={{ fontSize: '24px', color: '#FFD700' }} />;
        } else if (rank === 2) {
          return <TrophyOutlined style={{ fontSize: '24px', color: '#C0C0C0' }} />;
        } else if (rank === 3) {
          return <StarOutlined style={{ fontSize: '24px', color: '#CD7F32' }} />;
        } else {
          return <span className="text-gray-600 font-medium">{rank}</span>;
        }
      },
    },
    {
      title: 'Student',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <Avatar src={record.avatar} size="large" />
          <span className="ml-3 font-medium">{text}</span>
          {record.badge === 'gold' && <Tag color="gold" className="ml-2">Top Performer</Tag>}
          {record.badge === 'silver' && <Tag color="silver" className="ml-2">Excellent</Tag>}
          {record.badge === 'bronze' && <Tag color="#cd7f32" className="ml-2">Great Work</Tag>}
        </div>
      ),
    },
    {
      title: 'Points',
      dataIndex: 'points',
      key: 'points',
      render: (points) => (
        <span className="font-bold text-blue-600">{points}</span>
      ),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <div className="flex items-center">
          {progress > 0 ? (
            <>
              <RiseOutlined style={{ color: '#52c41a' }} />
              <span className="text-green-600 ml-1">{progress}%</span>
            </>
          ) : (
            <>
              <FallOutlined style={{ color: '#f5222d' }} />
              <span className="text-red-600 ml-1">{Math.abs(progress)}%</span>
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Subjects',
      dataIndex: 'subjects',
      key: 'subjects',
      render: (subjects) => (
        <div>
          {subjects.map((subject, index) => (
            <Tag key={index} color="geekblue" className="m-1">
              {subject}
            </Tag>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Student Leaderboard</h1>
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Weekly
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
              Monthly
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">
              All Time
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between bg-gray-100 p-3 rounded-t-lg">
            <div className="flex items-center">
              <Avatar
                size={48}
                src="https://randomuser.me/api/portraits/men/32.jpg"
                className="border-2 border-yellow-400"
              />
              <div className="ml-4">
                <h3 className="font-semibold">Your Position</h3>
                <p className="text-gray-600">Rank #8 with 720 points</p>
              </div>
            </div>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={studentData}
          pagination={false}
          className="rounded-lg overflow-hidden"
          rowClassName={(record, index) => 
            index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
          }
        />

        <div className="mt-6 flex justify-between items-center">
          <span className="text-gray-600">Showing top 5 of 128 students</span>
          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition">
            Load More
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Top Performers</h3>
          <div className="space-y-4">
            {studentData.slice(0, 3).map((student) => (
              <div key={student.key} className="flex items-center">
                <Avatar src={student.avatar} size="large" />
                <div className="ml-3">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-gray-600 text-sm">{student.points} points</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Most Improved</h3>
          <div className="space-y-4">
            {[...studentData]
              .sort((a, b) => b.progress - a.progress)
              .slice(0, 3)
              .map((student) => (
                <div key={student.key} className="flex items-center">
                  <Avatar src={student.avatar} size="large" />
                  <div className="ml-3">
                    <p className="font-medium">{student.name}</p>
                    <p className="text-green-600 text-sm flex items-center">
                      <RiseOutlined className="mr-1" />
                      +{student.progress}% this week
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Subjects Ranking</h3>
          <div className="space-y-3">
            {['Math', 'Science', 'English'].map((subject) => (
              <div key={subject} className="flex justify-between items-center">
                <span className="font-medium">{subject}</span>
                <Tag color="blue">Top: {
                  studentData.reduce((prev, current) => 
                    current.subjects.includes(subject) && current.points > (prev?.points || 0) ? current : prev
                  , {}).name
                }</Tag>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;