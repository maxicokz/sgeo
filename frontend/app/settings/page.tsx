'use client'

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, Shield, Database, Key, Users, Globe, Zap, Save, RefreshCw } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', name: 'Общие', icon: Settings },
    { id: 'notifications', name: 'Уведомления', icon: Bell },
    { id: 'security', name: 'Безопасность', icon: Shield },
    { id: 'api', name: 'API и интеграции', icon: Key },
    { id: 'users', name: 'Пользователи', icon: Users },
    { id: 'data', name: 'Данные', icon: Database },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Sidebar />

      <div className="ml-64 transition-all duration-300">
        <Header />

        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Настройки
              </h1>
              <p className="text-slate-600 mt-1">
                Управление параметрами системы и конфигурацией
              </p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all">
              <Save className="h-4 w-4 inline mr-2" />
              Сохранить изменения
            </button>
          </div>

          {/* Settings Navigation */}
          <section>
            <Card>
              <CardContent className="p-0">
                <div className="flex border-b">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                            : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.name}
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* General Settings */}
          {activeTab === 'general' && (
            <section className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Основные параметры</CardTitle>
                  <CardDescription>Общие настройки системы SGEO</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Название проекта
                    </label>
                    <input
                      type="text"
                      defaultValue="SGEO Dashboard"
                      className="w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Язык интерфейса
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                      <option value="kk">Қазақша</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Часовой пояс
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="Asia/Almaty">Астана (UTC+6)</option>
                      <option value="UTC">UTC</option>
                      <option value="Europe/Moscow">Москва (UTC+3)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">Тёмная тема</div>
                      <div className="text-sm text-slate-600">Использовать тёмное оформление интерфейса</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Параметры анализа</CardTitle>
                  <CardDescription>Настройки частоты и глубины анализа</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Частота автоматического анализа
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                      <option value="hourly">Каждый час</option>
                      <option value="daily">Ежедневно</option>
                      <option value="weekly">Еженедельно</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Количество запросов на тему
                    </label>
                    <input
                      type="number"
                      defaultValue="5"
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <p className="text-xs text-slate-500 mt-1">Количество промптов для каждой темы</p>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <section className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Настройки уведомлений</CardTitle>
                  <CardDescription>Управление типами и каналами уведомлений</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">Email уведомления</div>
                      <div className="text-sm text-slate-600">Получать уведомления на почту</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">Критические оповещения</div>
                      <div className="text-sm text-slate-600">Уведомления о критических проблемах</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">Еженедельные отчёты</div>
                      <div className="text-sm text-slate-600">Автоматическая отправка отчётов</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">Обновления источников</div>
                      <div className="text-sm text-slate-600">Уведомления о новых источниках</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <section className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Безопасность</CardTitle>
                  <CardDescription>Настройки безопасности и доступа</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Текущий пароль
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Новый пароль
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Подтвердите пароль
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium text-slate-900">Двухфакторная аутентификация</div>
                      <div className="text-sm text-slate-600">Дополнительный уровень защиты</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Активные сессии</CardTitle>
                  <CardDescription>Управление активными сеансами</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-slate-900">Chrome на Windows</div>
                          <div className="text-sm text-slate-600">Астана, Казахстан • IP: 195.210.xx.xx</div>
                          <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Текущая сессия
                          </div>
                        </div>
                        <Badge className="bg-green-50 text-green-700 border-green-200 border">Активна</Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg opacity-60">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-slate-900">Safari на MacOS</div>
                          <div className="text-sm text-slate-600">Алматы, Казахстан • IP: 195.210.xx.yy</div>
                          <div className="text-xs text-slate-600 mt-1">Последняя активность: 2 дня назад</div>
                        </div>
                        <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                          Завершить
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          )}

          {/* API Settings */}
          {activeTab === 'api' && (
            <section className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API ключи LLM систем</CardTitle>
                  <CardDescription>Управление API ключами для подключения к LLM</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {['ChatGPT', 'Perplexity', 'Gemini', 'Copilot', 'Bing'].map((llm) => (
                    <div key={llm} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-slate-900">{llm}</div>
                        <Badge className="bg-green-50 text-green-700 border-green-200 border">
                          Подключено
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value="sk-•••••••••••••••••••••••"
                          className="flex-1 px-3 py-2 text-sm rounded border bg-slate-50"
                          disabled
                        />
                        <button className="px-3 py-2 text-sm border rounded hover:bg-slate-50">
                          Изменить
                        </button>
                        <button className="px-3 py-2 text-sm text-blue-600 border border-blue-200 rounded hover:bg-blue-50">
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Webhook интеграции</CardTitle>
                  <CardDescription>Настройка веб-хуков для внешних систем</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      URL вебхука
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/webhook"
                      className="w-full px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <button className="px-4 py-2 rounded-lg border hover:bg-slate-50 transition-colors">
                    + Добавить вебхук
                  </button>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Users Settings */}
          {activeTab === 'users' && (
            <section className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Управление пользователями</CardTitle>
                  <CardDescription>Список пользователей и их права доступа</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Admin', email: 'admin@sgeo.kz', role: 'Администратор', status: 'active' },
                      { name: 'Analyst', email: 'analyst@sgeo.kz', role: 'Аналитик', status: 'active' },
                      { name: 'Viewer', email: 'viewer@sgeo.kz', role: 'Наблюдатель', status: 'inactive' },
                    ].map((user, i) => (
                      <div key={i} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-semibold">
                              {user.name[0]}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{user.name}</div>
                              <div className="text-sm text-slate-600">{user.email}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{user.role}</Badge>
                            {user.status === 'active' ? (
                              <Badge className="bg-green-50 text-green-700 border-green-200 border">Активен</Badge>
                            ) : (
                              <Badge variant="outline">Неактивен</Badge>
                            )}
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                              Изменить
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="mt-4 px-4 py-2 rounded-lg border hover:bg-slate-50 transition-colors">
                    + Добавить пользователя
                  </button>
                </CardContent>
              </Card>
            </section>
          )}

          {/* Data Settings */}
          {activeTab === 'data' && (
            <section className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Управление данными</CardTitle>
                  <CardDescription>Резервное копирование и экспорт данных</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Database className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-blue-900">Автоматическое резервное копирование</div>
                        <div className="text-sm text-blue-700 mt-1">
                          Последнее копирование: 15.01.2025 в 03:00
                        </div>
                        <div className="text-sm text-blue-700">
                          Следующее: 16.01.2025 в 03:00
                        </div>
                      </div>
                      <Badge className="bg-green-50 text-green-700 border-green-200 border">
                        Включено
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button className="p-4 border rounded-lg hover:shadow-md transition-all text-left group">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded bg-slate-100 group-hover:bg-slate-200">
                          <Database className="h-5 w-5 text-slate-600" />
                        </div>
                        <div className="font-medium text-slate-900">Создать бэкап</div>
                      </div>
                      <div className="text-sm text-slate-600">
                        Создать резервную копию всех данных
                      </div>
                    </button>

                    <button className="p-4 border rounded-lg hover:shadow-md transition-all text-left group">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded bg-slate-100 group-hover:bg-slate-200">
                          <Globe className="h-5 w-5 text-slate-600" />
                        </div>
                        <div className="font-medium text-slate-900">Экспорт данных</div>
                      </div>
                      <div className="text-sm text-slate-600">
                        Экспортировать данные в CSV/JSON
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50/50">
                <CardHeader>
                  <CardTitle className="text-red-900">Опасная зона</CardTitle>
                  <CardDescription className="text-red-700">
                    Необратимые действия с данными
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <button className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                    Очистить все данные
                  </button>
                  <p className="text-sm text-red-700 mt-2">
                    Это действие удалит все данные без возможности восстановления
                  </p>
                </CardContent>
              </Card>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
