import { View, Text, Button } from '@tarojs/components';
import { useState, useCallback } from 'react';
import Taro from '@tarojs/taro';
import './index.css';

interface UserInfo {
  nickname: string;
  avatarUrl: string;
}

export default function Profile() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = useCallback(async () => {
    try {
      const loginRes = await Taro.login();
      if (loginRes.code) {
        console.log('Login code:', loginRes.code);
        setIsLoggedIn(true);
        Taro.showToast({
          title: '登录成功',
          icon: 'success',
        });
      }
    } catch (error) {
      Taro.showToast({
        title: '登录失败',
        icon: 'none',
      });
    }
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggedIn(false);
    setUserInfo(null);
    Taro.showToast({
      title: '已退出登录',
      icon: 'success',
    });
  }, []);

  const menuItems = [
    {
      title: '我的设置',
      onClick: () => {
        Taro.showToast({
          title: '功能开发中',
          icon: 'none',
        });
      },
    },
    {
      title: '关于我们',
      onClick: () => {
        Taro.showToast({
          title: '功能开发中',
          icon: 'none',
        });
      },
    },
    {
      title: '意见反馈',
      onClick: () => {
        Taro.showToast({
          title: '功能开发中',
          icon: 'none',
        });
      },
    },
  ];

  return (
    <View className="min-h-screen bg-gray-50">
      <View className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 pb-12">
        {isLoggedIn && userInfo ? (
          <View className="flex flex-row items-center">
            <View className="w-16 h-16 rounded-full bg-white overflow-hidden mr-4">
              <Text className="w-full h-full">{userInfo.avatarUrl || '👤'}</Text>
            </View>
            <View>
              <Text className="text-white text-lg font-semibold">
                {userInfo.nickname || '用户'}
              </Text>
              <Text className="text-blue-100 text-sm">已登录</Text>
            </View>
          </View>
        ) : (
          <View className="flex flex-col items-center">
            <View className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <Text className="text-4xl">👤</Text>
            </View>
            <Text className="text-white text-lg font-medium mb-1">
              {isLoggedIn ? '用户' : '未登录'}
            </Text>
            <Text className="text-blue-100 text-sm">
              {isLoggedIn ? '已登录微信账号' : '登录后可同步数据'}
            </Text>
          </View>
        )}
      </View>

      <View className="px-4 -mt-6">
        <View className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
          {!isLoggedIn ? (
            <Button
              className="w-full py-4 text-blue-500 font-medium text-base bg-white"
              onClick={handleLogin}
            >
              微信登录
            </Button>
          ) : (
            <Button
              className="w-full py-4 text-red-500 font-medium text-base bg-white"
              onClick={handleLogout}
            >
              退出登录
            </Button>
          )}
        </View>

        <View className="bg-white rounded-lg shadow-sm overflow-hidden">
          {menuItems.map((item, index) => (
            <View
              key={index}
              className={`flex flex-row items-center justify-between py-4 px-4 ${
                index < menuItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
              onClick={item.onClick}
            >
              <Text className="text-gray-800">{item.title}</Text>
              <Text className="text-gray-400">›</Text>
            </View>
          ))}
        </View>

        <View className="mt-8 text-center">
          <Text className="text-gray-400 text-xs">
            待办事项 v1.0.0
          </Text>
        </View>
      </View>
    </View>
  );
}
