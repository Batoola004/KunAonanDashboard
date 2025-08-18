import React from 'react'
import "./home.scss"
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts'

export const Home = () => {

  // بيانات التبرعات المالية
  const donationData = [
    { month: 'يناير', amount: 1200 },
    { month: 'فبراير', amount: 2100 },
    { month: 'مارس', amount: 800 },
    { month: 'أبريل', amount: 1600 },
    { month: 'مايو', amount: 2500 },
    { month: 'يونيو', amount: 3000 },
  ]

  // بيانات التبرعات العينية
  const donationGoodsData = [
    { month: 'يناير', amount: 50 },
    { month: 'فبراير', amount: 30 },
    { month: 'مارس', amount: 70 },
    { month: 'أبريل', amount: 60 },
    { month: 'مايو', amount: 90 },
    { month: 'يونيو', amount: 100 },
  ]

  // بيانات المستخدمين
  const userData = [
    { name: "متبرعين", value: 400 },
    { name: "متطوعين", value: 300 },
    { name: "إداريين", value: 100 },
  ]

  // بيانات المستفيدين
  const beneficiaryData = [
    { name: "أطفال", value: 150 },
    { name: "طلاب", value: 100 },
    { name: "عائلات", value: 200 },
    { name: "شيوخ", value: 50 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  return (
    <div className='home'>
      <Sidebar/>
      <div className="homeContainer">
        <Navbar/>

        <div className="charts">

          {/* مخطط التبرعات المالية */}
          <div className="chartBox">
            <h3>📈 تطور التبرعات المالية</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#0a6866" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* مخطط التبرعات العينية */}
          <div className="chartBox">
            <h3>📦 تطور التبرعات العينية</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donationGoodsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#FF8042" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* مخطط المستخدمين */}
          <div className="chartBox">
            <h3>👥 توزيع المستخدمين</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {userData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* مخطط المستفيدين */}
          <div className="chartBox">
            <h3>🎯 توزيع المستفيدين</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={beneficiaryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#82ca9d"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {beneficiaryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Home
