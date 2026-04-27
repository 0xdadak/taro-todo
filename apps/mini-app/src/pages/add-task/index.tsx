import { View, Text, Input, Textarea, Button } from '@tarojs/components';
import { useState, useCallback } from 'react';
import Taro from '@tarojs/taro';
import './index.css';

export default function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const handleSave = useCallback(() => {
    if (!title.trim()) {
      Taro.showToast({
        title: '请输入任务标题',
        icon: 'none',
      });
      return;
    }

    Taro.showToast({
      title: '任务创建成功',
      icon: 'success',
    });

    setTimeout(() => {
      Taro.navigateBack();
    }, 1500);
  }, [title, description, priority]);

  return (
    <View className="min-h-screen bg-gray-50 p-4">
      <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <Text className="text-base font-medium text-gray-800 mb-2">
          任务标题
        </Text>
        <Input
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500"
          placeholder="请输入任务标题"
          value={title}
          onInput={(e) => setTitle(e.detail.value)}
        />
      </View>

      <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <Text className="text-base font-medium text-gray-800 mb-2">
          任务描述
        </Text>
        <Textarea
          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 min-h-[100px]"
          placeholder="请输入任务描述（可选）"
          value={description}
          onInput={(e) => setDescription(e.detail.value)}
          autoHeight
        />
      </View>

      <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <Text className="text-base font-medium text-gray-800 mb-2">
          优先级
        </Text>
        <View className="flex flex-row gap-2">
          <Button
            className={`flex-1 py-2 rounded-lg text-sm ${
              priority === 'low'
                ? 'bg-gray-100 text-gray-800'
                : 'bg-gray-50 text-gray-500'
            }`}
            onClick={() => setPriority('low')}
          >
            低
          </Button>
          <Button
            className={`flex-1 py-2 rounded-lg text-sm ${
              priority === 'medium'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-50 text-gray-500'
            }`}
            onClick={() => setPriority('medium')}
          >
            中
          </Button>
          <Button
            className={`flex-1 py-2 rounded-lg text-sm ${
              priority === 'high'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-50 text-gray-500'
            }`}
            onClick={() => setPriority('high')}
          >
            高
          </Button>
        </View>
      </View>

      <Button
        className="bg-blue-500 text-white rounded-lg py-3 px-4 w-full"
        onClick={handleSave}
      >
        保存任务
      </Button>
    </View>
  );
}
