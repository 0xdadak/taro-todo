import { View, Text, ScrollView } from '@tarojs/components';
import { useState } from 'react';
import './index.css';

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([]);

  return (
    <View className="min-h-screen bg-gray-50 p-4">
      <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <Text className="text-lg font-semibold text-gray-800">
          待办任务
        </Text>
      </View>

      <ScrollView className="h-full">
        {tasks.length === 0 ? (
          <View className="flex flex-col items-center justify-center py-12">
            <Text className="text-gray-400 text-lg mb-2">暂无任务</Text>
            <Text className="text-gray-400 text-sm">
              点击添加按钮创建你的第一个任务
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
            <View
              key={task.id}
              className="bg-white rounded-lg p-4 shadow-sm mb-3"
            >
              <Text className="text-base font-medium text-gray-800">
                {task.title}
              </Text>
              {task.description && (
                <Text className="text-sm text-gray-500 mt-1">
                  {task.description}
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
