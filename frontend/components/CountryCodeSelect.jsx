'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export const COUNTRY_CODES = [
  { code: '+91', iso: 'in', label: 'India', flag: 'https://flagcdn.com/w40/in.png' },
  { code: '+1', iso: 'us', label: 'United States', flag: 'https://flagcdn.com/w40/us.png' },
  { code: '+44', iso: 'gb', label: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png' },
  { code: '+1', iso: 'ca', label: 'Canada', flag: 'https://flagcdn.com/w40/ca.png' },
  { code: '+61', iso: 'au', label: 'Australia', flag: 'https://flagcdn.com/w40/au.png' },
  { code: '+971', iso: 'ae', label: 'United Arab Emirates', flag: 'https://flagcdn.com/w40/ae.png' },
  { code: '+65', iso: 'sg', label: 'Singapore', flag: 'https://flagcdn.com/w40/sg.png' },
  { code: '+49', iso: 'de', label: 'Germany', flag: 'https://flagcdn.com/w40/de.png' },
  { code: '+33', iso: 'fr', label: 'France', flag: 'https://flagcdn.com/w40/fr.png' },
  { code: '+81', iso: 'jp', label: 'Japan', flag: 'https://flagcdn.com/w40/jp.png' },
  { code: '+86', iso: 'cn', label: 'China', flag: 'https://flagcdn.com/w40/cn.png' },
  { code: '+966', iso: 'sa', label: 'Saudi Arabia', flag: 'https://flagcdn.com/w40/sa.png' },
  { code: '+27', iso: 'za', label: 'South Africa', flag: 'https://flagcdn.com/w40/za.png' },
  { code: '+55', iso: 'br', label: 'Brazil', flag: 'https://flagcdn.com/w40/br.png' },
  { code: '+7', iso: 'ru', label: 'Russia', flag: 'https://flagcdn.com/w40/ru.png' },
  { code: '+82', iso: 'kr', label: 'South Korea', flag: 'https://flagcdn.com/w40/kr.png' },
  { code: '+93', iso: 'af', label: 'Afghanistan', flag: 'https://flagcdn.com/w40/af.png' },
  { code: '+355', iso: 'al', label: 'Albania', flag: 'https://flagcdn.com/w40/al.png' },
  { code: '+213', iso: 'dz', label: 'Algeria', flag: 'https://flagcdn.com/w40/dz.png' },
  { code: '+376', iso: 'ad', label: 'Andorra', flag: 'https://flagcdn.com/w40/ad.png' },
  { code: '+244', iso: 'ao', label: 'Angola', flag: 'https://flagcdn.com/w40/ao.png' },
  { code: '+54', iso: 'ar', label: 'Argentina', flag: 'https://flagcdn.com/w40/ar.png' },
  { code: '+374', iso: 'am', label: 'Armenia', flag: 'https://flagcdn.com/w40/am.png' },
  { code: '+43', iso: 'at', label: 'Austria', flag: 'https://flagcdn.com/w40/at.png' },
  { code: '+994', iso: 'az', label: 'Azerbaijan', flag: 'https://flagcdn.com/w40/az.png' },
  { code: '+1242', iso: 'bs', label: 'Bahamas', flag: 'https://flagcdn.com/w40/bs.png' },
  { code: '+973', iso: 'bh', label: 'Bahrain', flag: 'https://flagcdn.com/w40/bh.png' },
  { code: '+880', iso: 'bd', label: 'Bangladesh', flag: 'https://flagcdn.com/w40/bd.png' },
  { code: '+1246', iso: 'bb', label: 'Barbados', flag: 'https://flagcdn.com/w40/bb.png' },
  { code: '+375', iso: 'by', label: 'Belarus', flag: 'https://flagcdn.com/w40/by.png' },
  { code: '+32', iso: 'be', label: 'Belgium', flag: 'https://flagcdn.com/w40/be.png' },
  { code: '+501', iso: 'bz', label: 'Belize', flag: 'https://flagcdn.com/w40/bz.png' },
  { code: '+229', iso: 'bj', label: 'Benin', flag: 'https://flagcdn.com/w40/bj.png' },
  { code: '+975', iso: 'bt', label: 'Bhutan', flag: 'https://flagcdn.com/w40/bt.png' },
  { code: '+591', iso: 'bo', label: 'Bolivia', flag: 'https://flagcdn.com/w40/bo.png' },
  { code: '+387', iso: 'ba', label: 'Bosnia and Herzegovina', flag: 'https://flagcdn.com/w40/ba.png' },
  { code: '+267', iso: 'bw', label: 'Botswana', flag: 'https://flagcdn.com/w40/bw.png' },
  { code: '+673', iso: 'bn', label: 'Brunei', flag: 'https://flagcdn.com/w40/bn.png' },
  { code: '+359', iso: 'bg', label: 'Bulgaria', flag: 'https://flagcdn.com/w40/bg.png' },
  { code: '+226', iso: 'bf', label: 'Burkina Faso', flag: 'https://flagcdn.com/w40/bf.png' },
  { code: '+257', iso: 'bi', label: 'Burundi', flag: 'https://flagcdn.com/w40/bi.png' },
  { code: '+855', iso: 'kh', label: 'Cambodia', flag: 'https://flagcdn.com/w40/kh.png' },
  { code: '+237', iso: 'cm', label: 'Cameroon', flag: 'https://flagcdn.com/w40/cm.png' },
  { code: '+238', iso: 'cv', label: 'Cape Verde', flag: 'https://flagcdn.com/w40/cv.png' },
  { code: '+236', iso: 'cf', label: 'Central African Rep.', flag: 'https://flagcdn.com/w40/cf.png' },
  { code: '+235', iso: 'td', label: 'Chad', flag: 'https://flagcdn.com/w40/td.png' },
  { code: '+56', iso: 'cl', label: 'Chile', flag: 'https://flagcdn.com/w40/cl.png' },
  { code: '+57', iso: 'co', label: 'Colombia', flag: 'https://flagcdn.com/w40/co.png' },
  { code: '+269', iso: 'km', label: 'Comoros', flag: 'https://flagcdn.com/w40/km.png' },
  { code: '+242', iso: 'cg', label: 'Congo', flag: 'https://flagcdn.com/w40/cg.png' },
  { code: '+243', iso: 'cd', label: 'Congo (DRC)', flag: 'https://flagcdn.com/w40/cd.png' },
  { code: '+506', iso: 'cr', label: 'Costa Rica', flag: 'https://flagcdn.com/w40/cr.png' },
  { code: '+385', iso: 'hr', label: 'Croatia', flag: 'https://flagcdn.com/w40/hr.png' },
  { code: '+53', iso: 'cu', label: 'Cuba', flag: 'https://flagcdn.com/w40/cu.png' },
  { code: '+357', iso: 'cy', label: 'Cyprus', flag: 'https://flagcdn.com/w40/cy.png' },
  { code: '+420', iso: 'cz', label: 'Czechia', flag: 'https://flagcdn.com/w40/cz.png' },
  { code: '+45', iso: 'dk', label: 'Denmark', flag: 'https://flagcdn.com/w40/dk.png' },
  { code: '+253', iso: 'dj', label: 'Djibouti', flag: 'https://flagcdn.com/w40/dj.png' },
  { code: '+1767', iso: 'dm', label: 'Dominica', flag: 'https://flagcdn.com/w40/dm.png' },
  { code: '+1809', iso: 'do', label: 'Dominican Rep.', flag: 'https://flagcdn.com/w40/do.png' },
  { code: '+593', iso: 'ec', label: 'Ecuador', flag: 'https://flagcdn.com/w40/ec.png' },
  { code: '+20', iso: 'eg', label: 'Egypt', flag: 'https://flagcdn.com/w40/eg.png' },
  { code: '+503', iso: 'sv', label: 'El Salvador', flag: 'https://flagcdn.com/w40/sv.png' },
  { code: '+240', iso: 'gq', label: 'Equatorial Guinea', flag: 'https://flagcdn.com/w40/gq.png' },
  { code: '+291', iso: 'er', label: 'Eritrea', flag: 'https://flagcdn.com/w40/er.png' },
  { code: '+372', iso: 'ee', label: 'Estonia', flag: 'https://flagcdn.com/w40/ee.png' },
  { code: '+268', iso: 'sz', label: 'Eswatini', flag: 'https://flagcdn.com/w40/sz.png' },
  { code: '+251', iso: 'et', label: 'Ethiopia', flag: 'https://flagcdn.com/w40/et.png' },
  { code: '+679', iso: 'fj', label: 'Fiji', flag: 'https://flagcdn.com/w40/fj.png' },
  { code: '+358', iso: 'fi', label: 'Finland', flag: 'https://flagcdn.com/w40/fi.png' },
  { code: '+241', iso: 'ga', label: 'Gabon', flag: 'https://flagcdn.com/w40/ga.png' },
  { code: '+220', iso: 'gm', label: 'Gambia', flag: 'https://flagcdn.com/w40/gm.png' },
  { code: '+995', iso: 'ge', label: 'Georgia', flag: 'https://flagcdn.com/w40/ge.png' },
  { code: '+233', iso: 'gh', label: 'Ghana', flag: 'https://flagcdn.com/w40/gh.png' },
  { code: '+30', iso: 'gr', label: 'Greece', flag: 'https://flagcdn.com/w40/gr.png' },
  { code: '+1473', iso: 'gd', label: 'Grenada', flag: 'https://flagcdn.com/w40/gd.png' },
  { code: '+502', iso: 'gt', label: 'Guatemala', flag: 'https://flagcdn.com/w40/gt.png' },
  { code: '+224', iso: 'gn', label: 'Guinea', flag: 'https://flagcdn.com/w40/gn.png' },
  { code: '+245', iso: 'gw', label: 'Guinea-Bissau', flag: 'https://flagcdn.com/w40/gw.png' },
  { code: '+592', iso: 'gy', label: 'Guyana', flag: 'https://flagcdn.com/w40/gy.png' },
  { code: '+509', iso: 'ht', label: 'Haiti', flag: 'https://flagcdn.com/w40/ht.png' },
  { code: '+504', iso: 'hn', label: 'Honduras', flag: 'https://flagcdn.com/w40/hn.png' },
  { code: '+852', iso: 'hk', label: 'Hong Kong', flag: 'https://flagcdn.com/w40/hk.png' },
  { code: '+36', iso: 'hu', label: 'Hungary', flag: 'https://flagcdn.com/w40/hu.png' },
  { code: '+354', iso: 'is', label: 'Iceland', flag: 'https://flagcdn.com/w40/is.png' },
  { code: '+62', iso: 'id', label: 'Indonesia', flag: 'https://flagcdn.com/w40/id.png' },
  { code: '+98', iso: 'ir', label: 'Iran', flag: 'https://flagcdn.com/w40/ir.png' },
  { code: '+964', iso: 'iq', label: 'Iraq', flag: 'https://flagcdn.com/w40/iq.png' },
  { code: '+353', iso: 'ie', label: 'Ireland', flag: 'https://flagcdn.com/w40/ie.png' },
  { code: '+972', iso: 'il', label: 'Israel', flag: 'https://flagcdn.com/w40/il.png' },
  { code: '+39', iso: 'it', label: 'Italy', flag: 'https://flagcdn.com/w40/it.png' },
  { code: '+225', iso: 'ci', label: 'Ivory Coast', flag: 'https://flagcdn.com/w40/ci.png' },
  { code: '+1876', iso: 'jm', label: 'Jamaica', flag: 'https://flagcdn.com/w40/jm.png' },
  { code: '+962', iso: 'jo', label: 'Jordan', flag: 'https://flagcdn.com/w40/jo.png' },
  { code: '+7', iso: 'kz', label: 'Kazakhstan', flag: 'https://flagcdn.com/w40/kz.png' },
  { code: '+254', iso: 'ke', label: 'Kenya', flag: 'https://flagcdn.com/w40/ke.png' },
  { code: '+686', iso: 'ki', label: 'Kiribati', flag: 'https://flagcdn.com/w40/ki.png' },
  { code: '+383', iso: 'xk', label: 'Kosovo', flag: 'https://flagcdn.com/w40/xk.png' },
  { code: '+965', iso: 'kw', label: 'Kuwait', flag: 'https://flagcdn.com/w40/kw.png' },
  { code: '+996', iso: 'kg', label: 'Kyrgyzstan', flag: 'https://flagcdn.com/w40/kg.png' },
  { code: '+856', iso: 'la', label: 'Laos', flag: 'https://flagcdn.com/w40/la.png' },
  { code: '+371', iso: 'lv', label: 'Latvia', flag: 'https://flagcdn.com/w40/lv.png' },
  { code: '+961', iso: 'lb', label: 'Lebanon', flag: 'https://flagcdn.com/w40/lb.png' },
  { code: '+266', iso: 'ls', label: 'Lesotho', flag: 'https://flagcdn.com/w40/ls.png' },
  { code: '+231', iso: 'lr', label: 'Liberia', flag: 'https://flagcdn.com/w40/lr.png' },
  { code: '+218', iso: 'ly', label: 'Libya', flag: 'https://flagcdn.com/w40/ly.png' },
  { code: '+423', iso: 'li', label: 'Liechtenstein', flag: 'https://flagcdn.com/w40/li.png' },
  { code: '+370', iso: 'lt', label: 'Lithuania', flag: 'https://flagcdn.com/w40/lt.png' },
  { code: '+352', iso: 'lu', label: 'Luxembourg', flag: 'https://flagcdn.com/w40/lu.png' },
  { code: '+853', iso: 'mo', label: 'Macao', flag: 'https://flagcdn.com/w40/mo.png' },
  { code: '+261', iso: 'mg', label: 'Madagascar', flag: 'https://flagcdn.com/w40/mg.png' },
  { code: '+265', iso: 'mw', label: 'Malawi', flag: 'https://flagcdn.com/w40/mw.png' },
  { code: '+60', iso: 'my', label: 'Malaysia', flag: 'https://flagcdn.com/w40/my.png' },
  { code: '+960', iso: 'mv', label: 'Maldives', flag: 'https://flagcdn.com/w40/mv.png' },
  { code: '+223', iso: 'ml', label: 'Mali', flag: 'https://flagcdn.com/w40/ml.png' },
  { code: '+356', iso: 'mt', label: 'Malta', flag: 'https://flagcdn.com/w40/mt.png' },
  { code: '+222', iso: 'mr', label: 'Mauritania', flag: 'https://flagcdn.com/w40/mr.png' },
  { code: '+230', iso: 'mu', label: 'Mauritius', flag: 'https://flagcdn.com/w40/mu.png' },
  { code: '+52', iso: 'mx', label: 'Mexico', flag: 'https://flagcdn.com/w40/mx.png' },
  { code: '+373', iso: 'md', label: 'Moldova', flag: 'https://flagcdn.com/w40/md.png' },
  { code: '+377', iso: 'mc', label: 'Monaco', flag: 'https://flagcdn.com/w40/mc.png' },
  { code: '+976', iso: 'mn', label: 'Mongolia', flag: 'https://flagcdn.com/w40/mn.png' },
  { code: '+382', iso: 'me', label: 'Montenegro', flag: 'https://flagcdn.com/w40/me.png' },
  { code: '+212', iso: 'ma', label: 'Morocco', flag: 'https://flagcdn.com/w40/ma.png' },
  { code: '+258', iso: 'mz', label: 'Mozambique', flag: 'https://flagcdn.com/w40/mz.png' },
  { code: '+95', iso: 'mm', label: 'Myanmar', flag: 'https://flagcdn.com/w40/mm.png' },
  { code: '+264', iso: 'na', label: 'Namibia', flag: 'https://flagcdn.com/w40/na.png' },
  { code: '+977', iso: 'np', label: 'Nepal', flag: 'https://flagcdn.com/w40/np.png' },
  { code: '+31', iso: 'nl', label: 'Netherlands', flag: 'https://flagcdn.com/w40/nl.png' },
  { code: '+64', iso: 'nz', label: 'New Zealand', flag: 'https://flagcdn.com/w40/nz.png' },
  { code: '+505', iso: 'ni', label: 'Nicaragua', flag: 'https://flagcdn.com/w40/ni.png' },
  { code: '+227', iso: 'ne', label: 'Niger', flag: 'https://flagcdn.com/w40/ne.png' },
  { code: '+234', iso: 'ng', label: 'Nigeria', flag: 'https://flagcdn.com/w40/ng.png' },
  { code: '+389', iso: 'mk', label: 'North Macedonia', flag: 'https://flagcdn.com/w40/mk.png' },
  { code: '+47', iso: 'no', label: 'Norway', flag: 'https://flagcdn.com/w40/no.png' },
  { code: '+968', iso: 'om', label: 'Oman', flag: 'https://flagcdn.com/w40/om.png' },
  { code: '+92', iso: 'pk', label: 'Pakistan', flag: 'https://flagcdn.com/w40/pk.png' },
  { code: '+970', iso: 'ps', label: 'Palestine', flag: 'https://flagcdn.com/w40/ps.png' },
  { code: '+507', iso: 'pa', label: 'Panama', flag: 'https://flagcdn.com/w40/pa.png' },
  { code: '+675', iso: 'pg', label: 'Papua New Guinea', flag: 'https://flagcdn.com/w40/pg.png' },
  { code: '+595', iso: 'py', label: 'Paraguay', flag: 'https://flagcdn.com/w40/py.png' },
  { code: '+51', iso: 'pe', label: 'Peru', flag: 'https://flagcdn.com/w40/pe.png' },
  { code: '+63', iso: 'ph', label: 'Philippines', flag: 'https://flagcdn.com/w40/ph.png' },
  { code: '+48', iso: 'pl', label: 'Poland', flag: 'https://flagcdn.com/w40/pl.png' },
  { code: '+351', iso: 'pt', label: 'Portugal', flag: 'https://flagcdn.com/w40/pt.png' },
  { code: '+974', iso: 'qa', label: 'Qatar', flag: 'https://flagcdn.com/w40/qa.png' },
  { code: '+40', iso: 'ro', label: 'Romania', flag: 'https://flagcdn.com/w40/ro.png' },
  { code: '+250', iso: 'rw', label: 'Rwanda', flag: 'https://flagcdn.com/w40/rw.png' },
  { code: '+685', iso: 'ws', label: 'Samoa', flag: 'https://flagcdn.com/w40/ws.png' },
  { code: '+378', iso: 'sm', label: 'San Marino', flag: 'https://flagcdn.com/w40/sm.png' },
  { code: '+221', iso: 'sn', label: 'Senegal', flag: 'https://flagcdn.com/w40/sn.png' },
  { code: '+381', iso: 'rs', label: 'Serbia', flag: 'https://flagcdn.com/w40/rs.png' },
  { code: '+248', iso: 'sc', label: 'Seychelles', flag: 'https://flagcdn.com/w40/sc.png' },
  { code: '+232', iso: 'sl', label: 'Sierra Leone', flag: 'https://flagcdn.com/w40/sl.png' },
  { code: '+421', iso: 'sk', label: 'Slovakia', flag: 'https://flagcdn.com/w40/sk.png' },
  { code: '+386', iso: 'si', label: 'Slovenia', flag: 'https://flagcdn.com/w40/si.png' },
  { code: '+252', iso: 'so', label: 'Somalia', flag: 'https://flagcdn.com/w40/so.png' },
  { code: '+211', iso: 'ss', label: 'South Sudan', flag: 'https://flagcdn.com/w40/ss.png' },
  { code: '+34', iso: 'es', label: 'Spain', flag: 'https://flagcdn.com/w40/es.png' },
  { code: '+94', iso: 'lk', label: 'Sri Lanka', flag: 'https://flagcdn.com/w40/lk.png' },
  { code: '+249', iso: 'sd', label: 'Sudan', flag: 'https://flagcdn.com/w40/sd.png' },
  { code: '+597', iso: 'sr', label: 'Suriname', flag: 'https://flagcdn.com/w40/sr.png' },
  { code: '+46', iso: 'se', label: 'Sweden', flag: 'https://flagcdn.com/w40/se.png' },
  { code: '+41', iso: 'ch', label: 'Switzerland', flag: 'https://flagcdn.com/w40/ch.png' },
  { code: '+963', iso: 'sy', label: 'Syria', flag: 'https://flagcdn.com/w40/sy.png' },
  { code: '+886', iso: 'tw', label: 'Taiwan', flag: 'https://flagcdn.com/w40/tw.png' },
  { code: '+992', iso: 'tj', label: 'Tajikistan', flag: 'https://flagcdn.com/w40/tj.png' },
  { code: '+255', iso: 'tz', label: 'Tanzania', flag: 'https://flagcdn.com/w40/tz.png' },
  { code: '+66', iso: 'th', label: 'Thailand', flag: 'https://flagcdn.com/w40/th.png' },
  { code: '+670', iso: 'tl', label: 'Timor-Leste', flag: 'https://flagcdn.com/w40/tl.png' },
  { code: '+228', iso: 'tg', label: 'Togo', flag: 'https://flagcdn.com/w40/tg.png' },
  { code: '+676', iso: 'to', label: 'Tonga', flag: 'https://flagcdn.com/w40/to.png' },
  { code: '+1868', iso: 'tt', label: 'Trinidad and Tobago', flag: 'https://flagcdn.com/w40/tt.png' },
  { code: '+216', iso: 'tn', label: 'Tunisia', flag: 'https://flagcdn.com/w40/tn.png' },
  { code: '+90', iso: 'tr', label: 'Turkey', flag: 'https://flagcdn.com/w40/tr.png' },
  { code: '+993', iso: 'tm', label: 'Turkmenistan', flag: 'https://flagcdn.com/w40/tm.png' },
  { code: '+256', iso: 'ug', label: 'Uganda', flag: 'https://flagcdn.com/w40/ug.png' },
  { code: '+380', iso: 'ua', label: 'Ukraine', flag: 'https://flagcdn.com/w40/ua.png' },
  { code: '+598', iso: 'uy', label: 'Uruguay', flag: 'https://flagcdn.com/w40/uy.png' },
  { code: '+998', iso: 'uz', label: 'Uzbekistan', flag: 'https://flagcdn.com/w40/uz.png' },
  { code: '+678', iso: 'vu', label: 'Vanuatu', flag: 'https://flagcdn.com/w40/vu.png' },
  { code: '+379', iso: 'va', label: 'Vatican City', flag: 'https://flagcdn.com/w40/va.png' },
  { code: '+58', iso: 've', label: 'Venezuela', flag: 'https://flagcdn.com/w40/ve.png' },
  { code: '+84', iso: 'vn', label: 'Vietnam', flag: 'https://flagcdn.com/w40/vn.png' },
  { code: '+967', iso: 'ye', label: 'Yemen', flag: 'https://flagcdn.com/w40/ye.png' },
  { code: '+260', iso: 'zm', label: 'Zambia', flag: 'https://flagcdn.com/w40/zm.png' },
  { code: '+263', iso: 'zw', label: 'Zimbabwe', flag: 'https://flagcdn.com/w40/zw.png' }
];

export default function CountryCodeSelect({ value = '+91', onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const selectedItem = COUNTRY_CODES.find((c) => c.code === value) || COUNTRY_CODES[0];

  const filteredCountries = COUNTRY_CODES.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search) ||
      c.iso.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    if (onChange) onChange(code);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div className={`relative shrink-0 ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-parchment/20 bg-ink/80 px-2.5 py-3 text-xs text-brass-bright font-mono font-bold hover:border-brass/40 transition-colors focus:outline-none focus:ring-1 focus:ring-brass"
        aria-expanded={isOpen}
      >
        <img
          src={selectedItem.flag}
          alt={selectedItem.label}
          className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm border border-white/20 shrink-0"
          loading="eager"
        />
        <span>{selectedItem.code}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-fog/60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1 w-64 max-h-72 flex flex-col rounded-xl border border-parchment/30 bg-[#0B132B] shadow-2xl z-50 overflow-hidden">
          {/* Search Box inside dropdown */}
          <div className="p-2 border-b border-parchment/15 bg-ink/90 relative">
            <Search className="w-3.5 h-3.5 text-fog/50 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or dial code..."
              className="w-full bg-ink-deep border border-parchment/20 rounded-lg pl-8 pr-3 py-1.5 text-xs text-parchment placeholder-fog/40 focus:outline-none focus:border-brass font-mono"
            />
          </div>

          <div className="overflow-y-auto max-h-56 py-1 scrollbar-thin scrollbar-thumb-parchment/20">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((item) => {
                const isSelected = item.code === value;
                return (
                  <button
                    key={`${item.iso}-${item.code}`}
                    type="button"
                    onClick={() => handleSelect(item.code)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? 'bg-brass/20 text-brass-bright font-bold'
                        : 'text-parchment/90 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <img
                      src={item.flag}
                      alt={item.label}
                      className="w-5 h-3.5 object-cover rounded-[2px] shadow-sm border border-white/20 shrink-0"
                      loading="lazy"
                    />
                    <span className="font-mono font-bold shrink-0">{item.code}</span>
                    <span className="text-fog/80 font-sans text-[0.72rem] truncate">{item.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brass-bright ml-auto shrink-0" />}
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-xs text-fog/50 font-mono text-center">
                No matching countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
