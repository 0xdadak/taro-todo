import { View, Text, Button } from '@tarojs/components';
import { useCallback, useState } from 'react';
import Taro from '@tarojs/taro';
import './index.css';

export default function Index() {
  const [greeting, setGreeting] = useState('欢迎使用待办事项');

  const handleNavigateToTasks = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/tasks/index',
    });
  }, []);

  const handleAddTask = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/add-task/index',
    });
  }, []);

  return (
    <View className="min-h-screen bg-gray-50 p-4">
      <View className="bg-white rounded-lg p-6 shadow-sm mb-4">
        <Text className="text-2xl font-bold text-gray-800 mb-2">
          {greeting}
        </Text>
        <Text className="text-gray-500">
          管理你的每日待办事项，提升工作效率
        </Text>
      </View>

      <View className="grid grid-cols-2 gap-4 mb-4">
        <View className="bg-blue-50 rounded-lg p-4">
          <Text className="text-3xl font-bold text-blue-600">0</Text>
          <Text className="text-sm text-gray-600">今日待办</Text>
        </View>
        <View className="bg-green-50 rounded-lg p-4">
          <Text className="text-3xl font-bold text-green-600">0</Text>
          <Text className="text-sm text-gray-600">已完成</Text>
        </View>
      </View>

      <View className="space-y-3">
        <Button
          className="bg-blue-500 text-white rounded-lg py-3 px-4"
          onClick={handleNavigateToTasks}
        >
          查看任务列表
        </Button>
        <Button
          className="bg-green-500 text-white rounded-lg py-3 px-4"
          onClick={handleAddTask}
        >
          添加新任务
        </Button>
      </View>
    </View>
  );
}
