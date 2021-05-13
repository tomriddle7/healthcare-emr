import React, { useState, useEffect } from "react";
import { patientList } from "../api";

interface Patient {
  personID: number;
  gender: String;
  birthDatetime: String;
  age: number;
  race: String;
  ethnicity: String;
  isDeath: boolean;
}
const App = () => {
  const [loading, setLoading] = useState(true);
  const [patiensts, setPatiensts] = useState([]);
  const [sortId, setSortId] = useState(false);
  const [sortSex, setSortSex] = useState(false);
  const [sortDate, setSortDate] = useState(false);
  const [sortAge, setSortAge] = useState(false);
  const [sortRace, setSortRace] = useState(false);
  const [sortEth, sestSortEth] = useState(false);
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [error, setError] = useState('');

  useEffect(() => {
    const getPatiensts = async () => {
      try {
        const {
          data: { patient: { list } }
        } = await patientList();
        setPatiensts(list);
        getPageArr();
      } catch (e) {
        setError("can't get Data");
      } finally {
        setLoading(false);
      }
    }
    getPatiensts();
  }, []);

  const handleChange = (event: any) => {
    setPerPage(Number(event.target.value));
  }

  const getPageArr = (): number[] => {
    const count = Math.floor(patiensts.length / perPage);
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(i);
    }
    return arr;
  }

  return loading ? (
    <>
      불러오는 중...
    </>
  ) : (
    <>
      <h1>환자 데이터</h1>
      <select
        value={perPage}
        onChange={handleChange}
      >
        <option value='10'>10</option>
        <option value='20'>20</option>
        <option value='30'>30</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>환자 ID</th>
            <th>성별</th>
            <th>생년월일</th>
            <th>나이</th>
            <th>인종</th>
            <th>민족</th>
            <th>사망 여부</th>
          </tr>
        </thead>
        <tbody>
          {patiensts.slice(page * perPage, page * perPage + perPage).map((patient: Patient, i: number) => {
            return (
              <tr key={patient.personID}>
                <td>{patient.personID}</td>
                <td>{patient.gender}</td>
                <td>{patient.birthDatetime}</td>
                <td>{patient.age}</td>
                <td>{patient.race}</td>
                <td>{patient.ethnicity}</td>
                <td>{patient.isDeath ? '사망' : '생존'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div>
        {getPageArr().map((e: number) => {
          return (
            <span key={e} style={page === e ? { fontWeight: 'bold', margin: '0 5px' } : { fontWeight: 'normal', margin: '0 5px' }} onClick={() => setPage(e)}>{e + 1}</span>
          )
        })}
      </div>
    </>
  );
}

export default App;
