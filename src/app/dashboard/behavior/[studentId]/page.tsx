"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  Tag,
  Select,
  List,
  Avatar,
  Statistic,
} from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import {
  fetchBehaviour,
  fetchBehaviourType,
} from "@/services/api";

const { Option } = Select;

const StudentBehaviorPage = () => {
  const { studentId } = useParams();
  const [filter, setFilter] = useState("all");
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const [behaviorTypes, setBehaviorTypes] = useState<BehaviorType[]>([]);
  const [behaviors, setBehaviors] = useState<Behavior[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  };

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
      const behaviourData = await fetchBehaviour(studentId);
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
  }, [studentId]);

  const filteredBehaviors = behaviors?.filter((behavior) => {
    if (filter === "positive") return behavior.points > 0;
    if (filter === "negative") return behavior.points < 0;
    if (filter === "neutral") return behavior.points === 0;
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
    <div className="p-6 max-w-5xl mx-auto">
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
            <Avatar src={currentUser?.avatar || ""} size="large" className="mr-4" />
            <div>
              <h2 className="text-lg font-semibold">
                {currentUser?.name}
              </h2>
              <p className="text-gray-500">{currentUser?.class || ""}</p>
            </div>
          </div>
        }
        extra={
          <Select
            defaultValue="all"
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
                          Recorded by {item.teacher || "Unknown"} on {item.date}
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
