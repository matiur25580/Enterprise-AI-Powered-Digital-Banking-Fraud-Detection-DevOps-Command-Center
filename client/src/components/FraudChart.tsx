import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
const data=[{d:'Mon',s:12},{d:'Tue',s:18},{d:'Wed',s:9},{d:'Thu',s:22},{d:'Fri',s:15},{d:'Sat',s:8},{d:'Sun',s:11}];
export function FraudTrend(){ return (<ResponsiveContainer width="100%" height={250}><LineChart data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="d"/><YAxis/><Tooltip/><Line type="monotone" dataKey="s" stroke="#7c3aed" strokeWidth={3}/></LineChart></ResponsiveContainer>); }
export function VolumeBar(){ return (<ResponsiveContainer width="100%" height={250}><BarChart data={data}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="d"/><YAxis/><Tooltip/><Bar dataKey="s" fill="#16a34a"/></BarChart></ResponsiveContainer>); }
