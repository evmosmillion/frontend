import { Spot } from "../../hooks/useGrid";
import { SPACE_WIDTH } from "./Home";
import Tooltip from "./Tooltip";
import styles from './Home.module.scss';
import React, { useEffect, useState } from 'react';
import { useGlobalState } from "../../hooks/globalState";

interface Props {
    spots: Spot[];
    editIndex: number;
    editLinkUrl: string;
    editTitle: string;
    editImageUrl: string;
}

// memorized, so that it's only re-rendered when necessary
export default React.memo(function Spots({ spots, editIndex, editLinkUrl, editTitle, editImageUrl }: Props) {
    const [shownSpots, setShownSpots] = useGlobalState('shownSpots');

    useEffect(() => {
        if (shownSpots >= spots.length) {
            return;
        }
        const timer = setTimeout(() => {
            setShownSpots(shownSpots + 1);
        }, 10);
        return () => clearTimeout(timer);
    }, [shownSpots, spots.length]);

    return <>
        {spots.slice(0, shownSpots).map((e, i) => {
            let href = (editIndex === e._index ? editLinkUrl : e.link);
            if (href === 'https://') {
                href = '';
            }
            const title = (editIndex === e._index ? editTitle : e.title).trim();

            let tooltipText: JSX.Element | string = '';
            if (href !== '' || title !== '') {
                let tooltipTitle = title === '' ? null : <>{title}<br/></>;
                let hrefToShow = href;
                if (hrefToShow.length > 80) {
                    hrefToShow = hrefToShow.slice(0, 80) + '...';
                }
                let tooltipLink = href === '' ? <em className={styles.muted}>(no link)</em> : <span className={styles.muted}>{hrefToShow}</span>;
                tooltipText = <>{tooltipTitle}{tooltipLink}</>;
            } 

            let classNames = [styles.cell];
            if (editIndex === e._index) {
                classNames.push(styles.hl);
            }
            if (e.width === 1 && e.height === 1) {
                classNames.push(styles.mini);
            }

            let src = editIndex === e._index ? editImageUrl : e.image;
            if (src === 'https://' || src === '') {
                src = '/images/transparent.png';
                classNames.push(styles.noimage);
            }

            const tooltip = <Tooltip
                content={tooltipText}
                element='img'
                props={{
                    src,
                    className: classNames.join(' '),
                    style: {
                        left: `${e.x * SPACE_WIDTH}px`,
                        top: `${e.y * SPACE_WIDTH}px`,
                        width: `${e.width * SPACE_WIDTH}px`,
                        height: `${e.height * SPACE_WIDTH}px`,
                        backgroundColor: '#' + e.owner.slice(-6),
                    },
                    "data-tokenid": e._index,
                    alt: '',
                }} 
            />;
            if (!href) {
                return <span key={i}>{tooltip}</span>;
            }
            return <a key={i} href={href} target='_blank'>{tooltip}</a>;
        })}
    </>
});
