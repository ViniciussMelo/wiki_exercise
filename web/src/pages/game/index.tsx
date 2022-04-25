import React, { useEffect, useState } from "react";
import { Select, Typography, Button, Table } from 'antd';
import { VscRunAll } from "react-icons/vsc";

import HeroesService, { CompareHero, CompareResponseDto } from "../../services/HeroesService";

const { Title } = Typography;
const { Option } = Select;

interface HeroInterface {
  id: number;
  name: string;
	images: {
    sm: string;
  };
  powerstats: {
    intelligence: number;
    strength: number;
    speed: number;
    durability: number;
    power: number;
    combat: number;
  };
}

interface DataSourceInterface {
  id: number;
  key: number;
  intelligence: number;
  strength: number;
  speed: number;
  durability: number;
  power: number;
  combat: number;
}

const columns = [
  {
    title: 'Intelligence',
    dataIndex: 'intelligence',
    align: 'right' as const,
  },
  {
    title: 'Strength',
    dataIndex: 'strength',
    align: 'right' as const,
  },
  {
    title: 'Speed',
    dataIndex: 'speed',
    align: 'right' as const,
  },
  {
    title: 'Durability',
    dataIndex: 'durability',
    align: 'right' as const,
  },
  {
    title: 'Power',
    dataIndex: 'power',
    align: 'right' as const,
  },
  {
    title: 'Combat',
    dataIndex: 'combat',
    align: 'right' as const,
  },
];

const colorHero1 = "Green";
const colorHero2 = "brown";

const Game = () => {
  const [heroes, setHeroes] = React.useState<HeroInterface[]>([]);
  const [heroDataSource1, setHeroDataSource1] = React.useState<DataSourceInterface[]>([]);
  const [heroDataSource2, setHeroDataSource2] = React.useState<DataSourceInterface[]>([]);
  const [heroMessage, setHeroMessage] = useState<CompareResponseDto>({} as CompareResponseDto);

  const loadHeroes = async () => {
    const { data } = await HeroesService.findAll();

    setHeroes(data);
  }

  const setValuesHero = (id: number, heroPos: number) => {
    const hero = heroes.find((hero) => hero.id === id);
    
    if (!hero) return

    const heroDataSource: DataSourceInterface = {
      id: hero.id,
      key: hero.id,
      intelligence: hero.powerstats.intelligence,
      strength: hero.powerstats.strength,
      speed: hero.powerstats.speed,
      durability: hero.powerstats.durability,
      power: hero.powerstats.power,
      combat: hero.powerstats.combat
    }

    if (heroPos === 1) {
      setHeroDataSource1([heroDataSource]);
    } else {
      setHeroDataSource2([heroDataSource]);
    }
  }

  const setValuesHero1 = (value: any) => {
    setValuesHero(+value, 1);
  }

  const setValuesHero2 = (value: any) => {
    setValuesHero(+value, 2);
  }

  const compareHeroes = async () => {
    const hero1ToCompare: CompareHero = {
      id: heroDataSource1[0].id,
      powerstats: {
        intelligence: heroDataSource1[0].intelligence,
        strength: heroDataSource1[0].strength,
        speed: heroDataSource1[0].speed,
        durability: heroDataSource1[0].durability,
        power: heroDataSource1[0].power,
        combat: heroDataSource1[0].combat,
      }
    }
    const hero2ToCompare: CompareHero = {
      id: heroDataSource2[0].id,
      powerstats: {
        intelligence: heroDataSource2[0].intelligence,
        strength: heroDataSource2[0].strength,
        speed: heroDataSource2[0].speed,
        durability: heroDataSource2[0].durability,
        power: heroDataSource2[0].power,
        combat: heroDataSource2[0].combat,
      }
    }

    const message = await HeroesService.compare({
      hero1: hero1ToCompare,
      hero2: hero2ToCompare
    });

    setHeroMessage(message);
  }

  useEffect(() => {
    loadHeroes();
  }, []);

  return (
    <>
      <div style={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Title>Hero Combat</Title>
      </div>
      {
        heroMessage &&
        (  <div style={{
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Title 
            style=
            { heroMessage.winner === 1 ? 
              { color: colorHero1 } : 
              heroMessage.winner === 0 ?
                { color: "black" } :
                { color: colorHero2 }
            }
              >
                {heroMessage.message}
              </Title>
          </div>
        )
      }      
      <div style={{
        display: 'flex',
        marginTop: '100px'
      }}>
        <div
          style={{
            width: '80%',
            textAlign: 'center'
          }}
        >

          <Title style={{ color: colorHero1 }}>Hero 1</Title>
          <Select 
            defaultValue={heroes[0] ? heroes[0].id : null } 
            style={{ width: '80%' }}
            onChange={setValuesHero1}
          >
            {heroes.map(hero => (
              <Option key={hero.id}>{hero.name}</Option>
            ))}
          </Select>
          <div
            style={{
              marginTop: '15px'
          }}>
            {
              !!heroDataSource1.length &&
              (
                <Table 
                  dataSource={heroDataSource1} 
                  columns={columns}
                  pagination={false}
                />
              )
            }
          </div>
        </div>
        <div
          style={{
            width: '80%',
            textAlign: 'center'
          }}
        >
          <Title style={{ color: colorHero2 }}>Hero 2</Title>
          <Select 
            defaultValue={heroes[0] ? heroes[0].id : null } 
            style={{ width: '80%' }}
            onChange={setValuesHero2}
          >
            {heroes.map(hero => (
              <Option key={hero.id}>{hero.name}</Option>
            ))}
          </Select>
          <div
            style={{
              marginTop: '15px',
              marginLeft: '15px'
          }}>
            {
              !!heroDataSource2.length &&
              (
                <Table 
                  dataSource={heroDataSource2} 
                  columns={columns}
                  pagination={false}
                />
              )
            }
          </div>
        </div>
      </div>
      <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Button 
            type="primary"
            icon={<VscRunAll />} 
            style={{
              marginTop: 30
            }}
            onClick={compareHeroes}
          >
            Fight
          </Button>
      </div>
    </>
  )
}

export default Game;