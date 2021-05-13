import React, { useState, useEffect } from "react";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { patientList, genderList, raceList, ethList, detail, chart } from "../api";

interface Patient {
  personID: number;
  gender: String;
  birthDatetime: String;
  age: number;
  race: String;
  ethnicity: String;
  isDeath: boolean;
  isOpen?: boolean;
}
const App = () => {
  const [loading, setLoading] = useState(true);
  const [patiensts, setPatiensts] = useState([]);
  const [onePatient, setPatient] = useState<any>({});
  const [sexChart, setSexChart] = useState({});
  const [raceChart, setRaceChart] = useState({});
  const [ethChart, setEthChart] = useState({});
  const [genders, setGenders] = useState([]);
  const [races, setRaces] = useState([]);
  const [eths, setEths] = useState([]);
  const [sortId, setSortId] = useState(false);
  const [sortSex, setSortSex] = useState(false);
  const [sortDate, setSortDate] = useState(false);
  const [sortAge, setSortAge] = useState(false);
  const [sortRace, setSortRace] = useState(false);
  const [sortEth, setSortEth] = useState(false);
  const [sortDeath, setSortDeath] = useState(false);
  const [emrFilter, setEmrFilter] = useState<any>({ gender: '', age: 0, race: '', ethnicity: '', isDeath: '' });
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [error, setError] = useState('');

  useEffect(() => {
    const getPatiensts = async () => {
      try {
        const {
          data: { patient: { list } }
        } = await patientList();
        const {
          data: { genderList: gender }
        } = await genderList();
        const {
          data: { raceList: race }
        } = await raceList();
        const {
          data: { ethnicityList }
        } = await ethList();
        const {
          data: { stats }
        } = await chart();
        setPatiensts(list.map((e: Patient) => { return { ...e, isOpen: false } }));
        setGenders(gender);
        setRaces(race);
        setEths(ethnicityList);
        const sex = stats.map((p: any) => { return p.gender; });
        const race1 = stats.map((p: any) => { return p.race; });
        const eth = stats.map((p: any) => { return p.ethnicity; });

        const sexArr: number[] = [];
        gender.forEach((element: string) => {
          sexArr.push(sex.filter((p: string) => p === element).length);
        });
        const race1Arr: number[] = [];
        race.forEach((element: string) => {
          race1Arr.push(race1.filter((p: string) => p === element).length);
        });
        const ethArr: number[] = [];
        ethnicityList.forEach((element: string) => {
          ethArr.push(eth.filter((p: string) => p === element).length);
        });



        setSexChart({
          title: {
            text: 'Gender Chart'
          },
          series: [{
            type: 'pie',
            data: sexArr,
          }]
        });
        setRaceChart({
          title: {
            text: 'Race Chart'
          },
          series: [{
            type: 'pie',
            data: race1Arr,
          }]
        });
        setEthChart({
          title: {
            text: 'Ethnicity Chart'
          },
          series: [{
            type: 'pie',
            data: ethArr
          }]
        });
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

  const openPatient = async (id: number) => {
    const { data } = await detail(id);
    setPatient(data);
  }

  return loading ? (
    <>
      불러오는 중...
    </>
  ) : (
    <>
      <h1>환자 데이터</h1>
      <HighchartsReact
        highcharts={Highcharts}
        options={sexChart}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={raceChart}
      />
      <HighchartsReact
        highcharts={Highcharts}
        options={ethChart}
      />
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
          <tr>
            <th></th>
            <th>
              <select
                value={emrFilter.gender}
                onChange={e => { setEmrFilter({ ...emrFilter, gender: e.target.value }); }}
              >
                <option value=''>전체</option>
                {genders.map((gen: string, index: number) => {
                  return (
                    <option key={index} value={gen}>{gen}</option>
                  )
                })}
              </select>
            </th>
            <th></th>
            <th><input value={emrFilter.age} onChange={e => { setEmrFilter({ ...emrFilter, age: Number(e.target.value) }); }} /></th>
            <th>
              <select
                value={emrFilter.race}
                onChange={e => { setEmrFilter({ ...emrFilter, race: e.target.value }); }}
              >
                <option value=''>전체</option>
                {races.map((ra: string, index: number) => {
                  return (
                    <option key={index} value={ra}>{ra}</option>
                  )
                })}
              </select>
            </th>
            <th>
              <select
                value={emrFilter.ethnicity}
                onChange={e => { setEmrFilter({ ...emrFilter, ethnicity: e.target.value }); }}
              >
                <option value=''>전체</option>
                {eths.map((eth: string, index: number) => {
                  return (
                    <option key={index} value={eth}>{eth}</option>
                  )
                })}
              </select>
            </th>
            <th>
              <select
                value={emrFilter.isDeath}
                onChange={e => { setEmrFilter({ ...emrFilter, isDeath: e.target.value }); }}
              >
                <option value=''>전체</option>
                <option value='false'>생존</option>
                <option value='true'>사망</option>
              </select>
            </th>
          </tr>
        </thead>
        <tbody>
          {patiensts.filter((p: Patient) => {
            if (p.gender === emrFilter.gender || emrFilter.gender === '') {
              if (p.age === emrFilter.age || emrFilter.age <= 0) {
                if (p.race === emrFilter.race || emrFilter.race === '') {
                  if (p.ethnicity === emrFilter.ethnicity || emrFilter.ethnicity === '') {
                    if (p.isDeath.toString() === emrFilter.isDeath || emrFilter.isDeath === '') {
                      return true;
                    }
                    else return false;
                  }
                  else return false;
                }
                else return false;
              }
              else return false;
            }
            else return false;
          }).slice(page * perPage, page * perPage + perPage).map((patient: Patient) => {
            return (
              <>
                <tr key={patient.personID} onClick={() => { if (!patient.isOpen) { openPatient(patient.personID) } patient.isOpen = !patient.isOpen; const temp = [...patiensts]; setPatiensts(temp); }}>
                  <td>{patient.personID}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.birthDatetime}</td>
                  <td>{patient.age}</td>
                  <td>{patient.race}</td>
                  <td>{patient.ethnicity}</td>
                  <td>{patient.isDeath ? '사망' : '생존'}</td>
                </tr>
                {patient.isOpen === true ? <div>방문횟수: {onePatient.visitCount}, 진단정보: {onePatient.conditionList.join(', ')}</div> : null}
              </>
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
