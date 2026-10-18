import type { Config } from 'tailwindcss';
export default {content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}'],theme:{extend:{colors:{ink:'#24201f',muted:'#77716d',cream:'#f8f5f0',sand:'#ede6dd',rose:'#a57067'},fontFamily:{sans:['Arial','Helvetica','sans-serif'],serif:['Georgia','Times New Roman','serif']}}},plugins:[]} satisfies Config;
