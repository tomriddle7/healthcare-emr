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
  const [sortEth, setSortEth] = useState(false);
  const [sortDeath, setSortDeath] = useState(false);
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
            <th onClick={() => { if (sortId) { patiensts.sort((a: Patient, b: Patient) => { return a.personID - b.personID }) } else { patiensts.sort((a: Patient, b: Patient) => { return b.personID - a.personID }) }; setSortId(!sortId); }}>환자 ID</th>
            <th onClick={() => { if (sortSex) { patiensts.sort((a: Patient, b: Patient) => { if (a.gender > b.gender) return 1; else return -1; }) } else { patiensts.sort((a: Patient, b: Patient) => { if (b.gender > a.gender) return 1; else return -1; }) }; setSortSex(!sortSex); }}>성별</th>
            <th onClick={() => { if (sortDate) { patiensts.sort((a: Patient, b: Patient) => { if (a.birthDatetime > b.birthDatetime) return 1; else return -1; }) } else { patiensts.sort((a: Patient, b: Patient) => { if (b.birthDatetime > a.birthDatetime) return 1; else return -1; }) }; setSortDate(!sortDate); }}>생년월일</th>
            <th onClick={() => { if (sortAge) { patiensts.sort((a: Patient, b: Patient) => { return a.age - b.age }) } else { patiensts.sort((a: Patient, b: Patient) => { return b.age - a.age }) }; setSortAge(!sortAge); }}>나이</th>
            <th onClick={() => { if (sortRace) { patiensts.sort((a: Patient, b: Patient) => { if (a.race > b.race) return 1; else return -1; }) } else { patiensts.sort((a: Patient, b: Patient) => { if (b.race > a.race) return 1; else return -1; }) }; setSortRace(!sortRace); }}>인종</th>
            <th onClick={() => { if (sortEth) { patiensts.sort((a: Patient, b: Patient) => { if (a.ethnicity > b.ethnicity) return 1; else return -1; }) } else { patiensts.sort((a: Patient, b: Patient) => { if (b.ethnicity > a.ethnicity) return 1; else return -1; }) }; setSortEth(!sortEth); }}>민족</th>
            <th onClick={() => { if (sortDeath) { patiensts.sort((a: Patient, b: Patient) => { if (a.isDeath > b.isDeath) return 1; else return -1; }) } else { patiensts.sort((a: Patient, b: Patient) => { if (b.isDeath > a.isDeath) return 1; else return -1; }) }; setSortDeath(!sortDeath); }}>사망 여부</th>
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
