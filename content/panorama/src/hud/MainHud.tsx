import React, { useEffect, useMemo } from 'react';
import Center from '../components/Center';
import Row from '../components/Row';
import { useXNetTableKey } from '../hooks/useXNetTable';
import Container from '../components/Container';
import Column from '../components/Column';

const PlayerCard: React.FC<{ playerId: PlayerID }> = props => {
    const playerName = useMemo(() => {
        return Players.GetPlayerName(props.playerId);
    }, []);

    const data = useXNetTableKey('scores', `p${props.playerId}`, { score: 0 });

    return (
        <Row style={{ padding: '20px', width: '300px' }}>
            <Column>
                <Container align={['left', 'center']}>
                    <Label text={playerName} />
                </Container>
                <Row style={{ marginTop: '10px' }}>
                    <Panel style={{ padding: '2px', backgroundColor: 'rgba(255,0,0,0.1)' }}>
                        <DOTAHeroImage heroname={'pudge'} />
                    </Panel>
                    <Container align={['center', 'center']}>
                        <Label text={`${data.score} 分`} style={{ marginLeft: '20px', fontSize: '40px', textShadow: '2px 2px 8px 3.0 #000000b0' }} />
                    </Container>
                </Row>
            </Column>
        </Row>
    );
};

const MainHud: React.FC = props => {
    const [visible, setVisible] = React.useState(false);

    useEffect(() => {
        setTimeout(() => {
            setVisible(true);
        }, 2000);
    }, []);

    return (
        <Panel
            className={'main-panel'}
            style={{
                width: '100%',
                marginTop: '130px',
                marginLeft: '20px',
                transform: `translateX(${visible ? 0 : -500}px)`,
                opacity: `${visible ? 1 : 0}`,
                transition: 'all 0.5s',
            }}
            hittest={false}
        >
            <Container align={['left', 'top']}>
                <Column className={'background-rock'}>
                    {Game.GetAllPlayerIDs().map(playerId => {
                        return <PlayerCard key={playerId} playerId={playerId} />;
                    })}
                    <Button
                        className={'ButtonBevel'}
                        style={{ width: '100%', margin: '0 10px 10px' }}
                        onactivate={() => {
                            GameEvents.SendCustomGameEventToServer('devCommand', {
                                type: 'restart',
                            });
                        }}
                    >
                        <Label text={'重新开始'} />
                    </Button>
                </Column>
            </Container>
        </Panel>
    );
};

export default MainHud;
