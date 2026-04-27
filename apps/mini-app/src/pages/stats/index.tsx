import { View, Text } from '@tarojs/components';
import { useState } from 'react';
import './index.css';

export default function Stats() {
  const [stats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    completionRate: 0,
  });

  return (
    <View className="min-h-screen bg-gray-50 p-4">
      <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          效率概览
        </Text>
        <View className="grid grid-cols-2 gap-4">
          <View className="bg-blue-50 rounded-lg p-4 text-center">
            <Text className="text-3xl font-bold text-blue-600">
              {stats.total}
            </Text>
            <Text className="text-sm text-gray-600">总任务数</Text>
          </View>
          <View className="bg-green-50 rounded-lg p-4 text-center">
            <Text className="text-3xl font-bold text-green-600">
              {stats.completed}
            </Text>
            <Text className="text-sm text-gray-600">已完成</Text>
          </View>
          <View className="bg-yellow-50 rounded-lg p-4 text-center">
            <Text className="text-3xl font-bold text-yellow-600">
              {stats.pending}
            </Text>
            <Text className="text-sm text-gray-600">待处理</Text>
          </View>
          <View className="bg-purple-50 rounded-lg p-4 text-center">
            <Text className="text-3xl font-bold text-purple-600">
              {stats.completionRate}%
            </Text>
            <Text className="text-sm text-gray-600">完成率</Text>
          </View>
        </View>
      </View>

      <View className="bg-white rounded-lg p-6 shadow-sm">
        <Text className="text-lg font-semibold text-gray-800 mb-4">
          数据趋势
        </Text>
        <View className="flex flex-col items-center justify-center py-8">
          <Text className="text-gray-400">暂无数据</Text>
          <Text className="text-gray-400 text-sm mt-1">
            完成任务后即可查看统计数据
          </Text>
        </View>
      </View>
    </View>
  );
}
