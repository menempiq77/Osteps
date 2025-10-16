"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, Tag, Select, List, Avatar, Statistic, Breadcrumb } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchBehaviour, fetchBehaviourType } from "@/services/behaviorApi";
import Link from "next/link";

const { Option } = Select;

type BehaviorType = {
  id: string;
  name: string;
  points: number;
  color: string;
};

type Behavior = {
  id: string;
  behaviour_id: string;
  description: string;
  date: string;
  teacher?: string;
  points: number;
  teacher_name: string;
};

interface CurrentUser {
  student?: string;
  avatar?: string;
  name?: string;
  class?: string;
  role?: string;
}

const StudentBehaviorPage = () => {
  const [filter, setFilter] = useState("all");
  // const { currentUser } = useSelector((state: RootState) => state.auth);
  const { currentUser } = useSelector((state: RootState) => state.auth) as {
    currentUser: CurrentUser;
  };
  const [behaviorTypes, setBehaviorTypes] = useState<BehaviorType[]>([]);
  const [behaviors, setBehaviors] = useState<Behavior[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBehaviorTypes = async () => {
    try {
      setIsLoading(true);
      const behaviourType = await fetchBehaviourType();
      setBehaviorTypes(behaviourType);
    } catch (err) {
      setError("Failed to load behaviour Type");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  const loadBehavior = async () => {
    try {
      setIsLoading(true);
      const behaviourData = await fetchBehaviour(currentUser?.student);
      setBehaviors(behaviourData);
    } catch (err) {
      setError("Failed to load behaviour");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBehavior();
    loadBehaviorTypes();
  }, [currentUser?.student]);

  const filteredBehaviors = behaviors?.filter((behavior) => {
    const behaviorType = behaviorTypes.find(
      (t) => t.id === behavior.behaviour_id
    );
    if (!behaviorType) return false; // Skip if type not found

    if (filter === "positive") return behaviorType.points > 0;
    if (filter === "negative") return behaviorType.points < 0;
    if (filter === "neutral") return behaviorType.points == 0;
    return true; // 'all'
  });

  const {
    totalPoints,
    totalPositivePoints,
    totalNegativePoints,
    positiveBehaviors,
    negativeBehaviors,
  } = useMemo(() => {
    let total = 0;
    let totalPositive = 0;
    let totalNegative = 0;

    const positive: Behavior[] = [];
    const negative: Behavior[] = [];

    behaviors.forEach((behavior) => {
      const behaviorType = behaviorTypes.find(
        (t) => t.id === behavior.behaviour_id
      );
      if (behaviorType) {
        const points = Number(behaviorType.points);
        total += points;

        if (points > 0) {
          totalPositive += points;
          positive.push(behavior);
        } else if (points < 0) {
          totalNegative += points;
          negative.push(behavior);
        }
      }
    });

    return {
      totalPoints: total,
      totalPositivePoints: totalPositive,
      totalNegativePoints: totalNegative,
      positiveBehaviors: positive,
      negativeBehaviors: negative,
    };
  }, [behaviors, behaviorTypes]);

  return (
    <div className="p-3 md:p-6 max-w-6xl mx-auto">
      <Breadcrumb
        items={[
          {
            title: <Link href="/dashboard">Dashboard</Link>,
          },
          {
            title: <span>Behavior</span>,
          },
        ]}
        className="!mb-6"
      />

      <h1 className="text-2xl font-bold mb-6">Student Behavior</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <Statistic
            title="Total Points"
            value={totalPoints}
            valueStyle={{ color: totalPoints >= 0 ? "#3f8600" : "#cf1322" }}
            prefix={
              totalPoints >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />
            }
          />
        </Card>
        <Card>
          <Statistic
            title="Positive Points"
            value={totalPositivePoints}
            valueStyle={{ color: "#3f8600" }}
            prefix={<ArrowUpOutlined />}
          />
        </Card>
        <Card>
          <Statistic
            title="Negative Points"
            value={totalNegativePoints}
            valueStyle={{ color: "#cf1322" }}
            prefix={<ArrowDownOutlined />}
          />
        </Card>
      </div>

      <Card
        title={
          <div className="flex items-center gap-2">
            <Avatar
              src={currentUser?.avatar || null}
              size="large"
              className="mr-4"
            >
              {currentUser?.name?.charAt(0) || "U"}
            </Avatar>
            <div>
              <h2 className="text-lg font-semibold">{currentUser?.name}</h2>
              <p className="text-gray-500">{currentUser?.class || ""}</p>
            </div>
          </div>
        }
        extra={
          <Select
            value={filter}
            style={{ width: 120 }}
            onChange={(value) => setFilter(value)}
          >
            <Option value="all">All Behaviors</Option>
            <Option value="positive">Positive</Option>
            <Option value="negative">Negative</Option>
            <Option value="neutral">Neutral</Option>
          </Select>
        }
      >
        <List
          itemLayout="vertical"
          dataSource={filteredBehaviors}
          renderItem={(item) => (
            <List.Item>
              <div className="flex justify-between w-full">
                <div>
                  {(() => {
                    const behaviorType = behaviorTypes.find(
                      (t) => t.id === item.behaviour_id
                    );
                    return (
                      <>
                        <Tag color={behaviorType?.color || "gray"}>
                          {behaviorType?.name || "Unknown"}(
                          {(behaviorType?.points ?? 0) > 0 ? "+" : ""}
                          {behaviorType?.points || 0})
                        </Tag>
                        <p className="mt-2 font-medium">{item.description}</p>
                        <p className="text-sm text-gray-500">
                          Recorded by {item.teacher?.teacher_name || "Teacher"}{" "}
                          on {item.date}
                        </p>
                      </>
                    );
                  })()}
                </div>
              </div>
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default StudentBehaviorPage;
