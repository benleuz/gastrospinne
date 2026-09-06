/* Gastroführer – gastro.js */
'use strict';

const GF_VERSION = '0.7.4';

// Karte Zürich: Stadtkreise (aus offenen Quartierdaten der Stadt Zürich zusammengefasst, vereinfacht; See angenähert)
const ZH_MAP = {"W":440,"H":420,"lake":"M241.0,246.8 L260.1,290.9 L275.6,320.2 L304.3,347.4 L231.5,379.3 L222.6,335.0 L213.0,296.2 L215.9,271.5 L226.6,255.6 L230.2,247.5 L241.0,246.8Z","k":{"5":{"d":"M128.3,158.4 L136.9,158.3 L139.1,156.2 L137.2,153.1 L143.4,152.1 L144.5,151.3 L145.2,148.1 L164.1,150.0 L172.9,154.7 L190.1,160.8 L197.8,165.9 L225.1,190.4 L224.2,191.6 L225.4,196.1 L225.1,200.8 L224.0,203.7 L202.8,194.5 L200.9,195.5 L200.0,193.0 L192.7,189.5 L164.0,178.1 L160.9,175.8 L157.8,170.1 L156.2,171.6 L145.5,168.1 L139.6,163.2 L128.3,158.4Z","cx":186.3,"cy":177.0},"10":{"d":"M55.8,83.3 L57.3,82.2 L57.1,80.6 L60.6,75.6 L58.5,72.1 L59.7,68.5 L64.3,68.1 L77.7,60.7 L77.0,59.2 L79.3,52.3 L81.9,53.7 L83.0,55.7 L87.6,55.0 L88.5,49.2 L91.5,50.4 L91.5,51.9 L98.0,54.1 L103.5,52.7 L103.9,54.3 L111.7,57.4 L111.8,59.0 L118.7,61.1 L118.3,62.9 L123.7,69.1 L133.0,74.7 L135.3,78.9 L135.1,81.2 L136.3,85.2 L139.7,82.1 L144.4,86.5 L146.7,85.9 L146.8,87.5 L148.8,88.7 L161.3,89.4 L167.7,92.4 L174.6,91.8 L186.3,98.0 L191.0,102.4 L192.6,106.2 L192.2,107.1 L196.5,105.3 L199.0,110.3 L203.7,113.8 L205.4,117.6 L205.4,121.3 L208.8,128.4 L208.1,133.1 L209.4,136.2 L209.4,139.3 L210.5,139.1 L209.3,145.9 L213.3,153.6 L218.8,160.6 L218.8,171.0 L214.7,176.7 L211.9,176.8 L210.8,178.3 L199.9,167.8 L190.1,160.8 L172.9,154.7 L163.5,149.9 L142.7,147.4 L128.4,135.4 L119.7,133.3 L106.6,135.0 L101.0,133.7 L97.6,131.0 L89.6,120.2 L80.0,116.7 L80.1,112.5 L78.2,112.1 L77.4,108.5 L77.9,98.1 L73.5,96.1 L74.5,92.3 L76.4,91.6 L77.7,88.2 L72.1,86.5 L70.0,87.2 L67.8,89.9 L67.0,93.0 L63.0,91.7 L63.2,90.2 L61.6,89.4 L61.3,86.1 L57.6,87.1 L55.8,83.3Z","cx":141.4,"cy":113.1},"6":{"d":"M194.4,100.5 L199.4,96.1 L205.9,99.1 L207.1,101.5 L207.6,100.5 L218.6,106.5 L222.8,106.8 L230.2,115.1 L228.4,116.3 L228.9,117.4 L230.4,117.5 L232.6,121.0 L239.3,126.8 L237.1,129.1 L237.7,130.4 L243.4,129.0 L246.8,133.3 L257.8,123.6 L262.5,128.5 L264.7,125.5 L264.2,128.4 L260.2,132.8 L262.0,135.4 L268.8,134.8 L269.4,133.7 L274.2,135.2 L283.0,145.4 L288.7,149.4 L297.0,159.6 L288.4,166.9 L282.7,174.8 L277.8,169.8 L272.0,176.1 L267.5,177.2 L265.3,182.7 L261.0,188.3 L253.1,194.5 L259.0,202.2 L252.9,209.3 L248.8,211.3 L248.0,210.0 L243.7,211.2 L240.5,204.4 L239.7,203.6 L236.0,205.3 L234.9,201.2 L231.8,202.1 L226.0,191.2 L210.8,178.3 L212.0,176.7 L214.8,176.6 L218.2,172.8 L218.7,160.6 L213.3,153.6 L209.4,146.1 L210.3,139.4 L209.4,139.5 L209.4,136.3 L208.1,133.0 L208.8,128.6 L205.4,121.2 L205.4,117.6 L203.7,113.8 L198.8,110.0 L194.4,100.5Z","cx":255.1,"cy":156.6},"11":{"d":"M94.9,27.9 L95.1,25.2 L98.3,20.8 L121.8,14.5 L132.9,8.9 L137.2,8.0 L156.1,17.0 L162.8,21.5 L170.5,18.3 L172.5,19.7 L177.0,17.8 L191.0,20.0 L193.2,13.3 L204.5,17.1 L205.5,15.1 L211.1,16.4 L212.9,15.6 L221.0,19.4 L228.0,20.5 L228.6,17.9 L236.3,19.3 L234.6,14.3 L235.3,14.3 L248.3,19.5 L264.5,22.1 L268.0,37.6 L270.4,40.2 L268.5,42.3 L269.3,43.1 L268.3,44.7 L269.0,45.3 L261.8,56.9 L277.5,66.2 L278.7,65.8 L281.2,72.6 L282.4,72.3 L283.3,75.0 L272.9,79.5 L272.9,84.3 L271.9,84.5 L272.6,109.0 L272.1,111.4 L268.9,112.3 L265.9,117.7 L269.0,117.3 L269.2,120.4 L262.5,128.6 L257.7,123.7 L246.8,133.3 L243.3,129.1 L237.7,130.5 L237.0,129.2 L239.1,126.7 L232.6,121.0 L230.4,117.5 L228.9,117.5 L228.2,116.4 L230.1,115.0 L222.9,106.8 L218.7,106.5 L207.7,100.5 L207.1,101.7 L205.9,99.1 L201.9,97.0 L201.5,97.9 L199.4,96.1 L194.5,100.4 L196.5,105.3 L192.1,107.2 L192.6,106.0 L191.1,102.5 L186.3,98.0 L174.4,91.7 L167.7,92.4 L161.3,89.4 L148.7,88.7 L146.7,87.6 L146.6,85.9 L144.4,86.5 L139.7,82.1 L136.3,85.3 L135.1,81.2 L135.3,78.8 L133.0,74.7 L123.7,69.1 L118.2,62.9 L118.6,61.0 L111.7,59.0 L111.6,57.4 L103.3,54.0 L104.8,50.2 L108.8,51.5 L110.7,46.1 L108.5,44.4 L108.8,39.4 L97.0,34.1 L94.9,27.9Z","cx":203.4,"cy":70.7},"1":{"d":"M202.0,239.0 L206.3,233.7 L212.1,220.5 L221.9,208.8 L225.3,200.0 L225.4,196.1 L224.2,191.5 L225.1,190.4 L231.8,202.1 L234.9,201.2 L236.1,205.2 L239.8,203.6 L243.7,211.3 L248.1,209.9 L253.6,228.5 L249.2,236.2 L253.7,241.6 L251.3,244.1 L252.8,246.2 L249.8,247.9 L244.6,255.8 L241.0,246.8 L230.2,247.5 L228.0,252.4 L221.3,241.1 L216.5,240.0 L215.3,237.9 L212.6,238.0 L204.8,242.3 L202.0,239.0Z","cx":231.4,"cy":224.5},"7":{"d":"M248.5,211.2 L254.1,208.4 L259.0,202.2 L253.0,194.3 L261.0,188.4 L265.3,182.7 L267.5,177.2 L272.1,176.1 L277.8,169.8 L282.9,174.6 L288.5,166.7 L297.2,159.5 L311.7,164.8 L319.2,162.4 L320.0,159.6 L322.3,160.6 L329.3,170.3 L328.3,172.4 L328.8,173.0 L333.8,171.5 L333.7,169.3 L336.0,164.2 L340.0,165.0 L339.9,166.4 L341.7,169.0 L340.2,173.0 L352.4,178.8 L354.7,181.0 L354.5,182.4 L355.8,182.5 L353.8,186.2 L349.3,184.2 L347.6,187.5 L346.3,187.6 L352.5,189.9 L351.0,192.4 L357.1,199.9 L364.5,206.2 L363.4,208.7 L365.5,212.9 L364.2,215.4 L367.1,218.2 L367.7,219.5 L366.9,220.6 L373.5,225.2 L375.8,230.2 L379.0,231.6 L385.6,240.6 L390.6,244.6 L399.9,247.3 L403.9,243.2 L408.2,244.3 L411.0,242.3 L413.3,247.4 L411.4,252.6 L407.0,255.4 L408.6,261.9 L406.6,262.2 L406.4,266.1 L417.3,267.2 L425.1,272.1 L423.5,273.4 L422.2,280.6 L427.4,287.0 L432.0,290.3 L424.0,295.0 L415.3,293.3 L415.1,291.8 L408.7,291.2 L404.3,292.6 L401.2,291.4 L396.1,294.9 L383.3,294.1 L378.6,298.9 L378.4,304.1 L375.8,304.3 L367.0,300.9 L363.8,301.8 L360.8,300.1 L356.6,301.1 L350.1,295.5 L348.4,297.2 L342.4,295.9 L341.3,297.3 L337.8,296.7 L336.9,298.0 L334.2,296.4 L331.5,297.4 L327.2,293.5 L325.4,294.8 L322.3,294.0 L321.9,292.3 L319.0,291.1 L318.6,289.5 L314.5,289.4 L313.8,287.7 L311.9,287.2 L311.7,284.7 L310.1,282.1 L306.0,278.4 L299.3,279.1 L298.1,276.0 L295.0,275.1 L292.6,275.9 L289.5,272.8 L282.6,273.3 L278.1,269.5 L276.3,264.4 L272.0,261.8 L267.5,256.8 L248.9,250.2 L249.9,247.9 L252.7,246.2 L251.2,244.1 L253.5,241.4 L249.2,236.2 L253.6,228.6 L248.5,211.2Z","cx":315.6,"cy":233.9},"8":{"d":"M244.6,255.8 L248.9,250.2 L257.0,252.3 L261.8,255.3 L263.3,254.7 L276.5,264.4 L276.1,265.2 L278.1,269.5 L282.6,273.3 L289.5,272.8 L292.6,275.9 L295.0,275.0 L298.1,276.0 L299.3,279.1 L306.0,278.4 L310.1,282.1 L311.7,284.7 L311.9,287.2 L313.8,287.7 L314.6,289.4 L318.6,289.5 L319.0,291.1 L321.9,292.3 L322.3,294.0 L325.4,294.8 L327.3,293.5 L332.1,297.6 L334.2,296.4 L336.8,298.0 L338.4,296.7 L332.9,303.8 L328.9,303.2 L329.3,304.6 L319.9,311.3 L316.0,311.1 L300.2,318.3 L298.7,315.3 L293.3,318.3 L291.9,316.9 L289.7,317.7 L280.5,324.7 L275.6,320.2 L260.1,290.9 L249.3,267.2 L244.6,255.8Z","cx":285.7,"cy":287.4},"2":{"d":"M133.7,402.8 L134.6,391.6 L136.7,385.7 L133.9,378.1 L133.8,373.5 L134.9,371.0 L134.1,369.5 L137.5,364.6 L135.9,359.6 L136.6,355.8 L138.2,353.9 L137.6,349.4 L138.6,348.3 L139.6,342.9 L145.9,334.3 L154.8,327.9 L164.7,328.7 L167.4,330.2 L172.0,329.7 L176.0,326.4 L171.1,312.6 L171.5,307.5 L174.4,304.1 L186.6,299.0 L191.1,295.1 L190.5,282.2 L186.8,263.1 L187.0,257.0 L188.8,251.8 L201.5,238.4 L204.8,242.3 L212.6,238.0 L215.3,237.9 L216.4,240.0 L221.3,241.1 L228.0,252.4 L215.9,271.5 L213.0,296.2 L222.6,335.0 L228.8,364.8 L224.7,370.3 L219.3,374.6 L218.8,376.7 L208.2,379.1 L206.4,384.8 L203.3,385.3 L203.2,388.4 L199.5,388.4 L198.2,390.9 L193.9,390.8 L193.5,392.4 L190.2,391.2 L190.1,395.5 L188.9,398.0 L184.8,397.3 L184.7,398.7 L178.4,398.5 L174.6,401.3 L169.5,401.5 L167.4,403.1 L163.2,402.4 L160.0,404.8 L155.2,405.5 L155.0,406.8 L151.1,405.5 L144.9,407.6 L139.8,411.9 L135.9,408.1 L133.7,402.8Z","cx":196.2,"cy":319.5},"4":{"d":"M126.5,171.5 L129.6,164.4 L134.0,160.8 L139.6,163.2 L145.5,168.1 L156.2,171.6 L157.9,170.1 L160.9,175.8 L164.0,178.1 L192.8,189.5 L200.0,193.0 L201.0,195.6 L202.8,194.5 L224.0,203.7 L221.8,208.9 L210.9,222.4 L205.2,235.4 L199.6,240.3 L199.0,238.7 L194.3,237.4 L178.3,218.9 L171.6,217.0 L157.8,208.0 L156.4,208.2 L142.4,197.9 L139.9,197.4 L139.5,196.1 L146.1,189.8 L139.3,185.1 L144.1,179.7 L126.5,171.5Z","cx":181.8,"cy":200.8},"3":{"d":"M92.6,278.5 L102.8,263.9 L118.2,256.9 L118.5,254.6 L117.6,253.8 L117.5,253.1 L120.7,244.8 L118.5,244.6 L119.5,242.7 L131.3,234.5 L138.6,223.5 L128.8,210.1 L139.9,197.4 L142.4,197.9 L156.4,208.2 L157.8,208.0 L171.7,217.0 L178.4,219.0 L194.2,237.4 L199.1,238.7 L199.6,240.3 L190.1,249.9 L186.9,257.7 L187.0,264.7 L190.5,282.2 L191.1,295.1 L186.6,299.0 L173.8,304.5 L171.0,308.9 L171.1,312.7 L176.1,326.4 L172.0,329.7 L167.4,330.2 L164.7,328.7 L154.8,327.9 L148.9,331.8 L143.0,337.4 L139.6,343.0 L138.6,348.3 L137.6,349.5 L138.2,354.0 L137.1,354.9 L136.4,352.0 L129.3,343.2 L127.6,336.1 L125.1,333.3 L125.3,330.6 L127.7,328.4 L126.8,323.7 L123.5,319.2 L120.5,317.7 L119.5,315.2 L115.2,312.8 L110.4,304.5 L108.3,304.8 L103.8,299.7 L101.0,299.6 L101.4,294.8 L96.4,290.2 L95.5,283.2 L92.6,278.5Z","cx":142.9,"cy":271.6},"9":{"d":"M8.0,200.0 L16.9,198.7 L21.6,200.0 L27.4,198.4 L28.7,197.5 L28.8,192.3 L32.9,192.8 L30.6,189.4 L30.8,187.8 L36.7,179.9 L38.8,176.0 L39.2,172.6 L49.0,161.0 L53.9,163.2 L53.3,161.0 L54.3,155.4 L48.9,149.6 L48.3,147.7 L57.1,149.4 L60.9,151.4 L62.1,150.1 L65.1,151.9 L64.2,148.3 L67.8,147.6 L68.8,144.4 L49.0,136.4 L50.2,133.1 L54.8,134.8 L55.8,132.1 L51.3,130.1 L55.1,119.7 L75.7,116.7 L84.0,117.3 L90.9,121.3 L97.6,130.9 L101.0,133.7 L107.0,135.0 L119.1,133.3 L127.1,134.9 L132.4,137.7 L140.1,146.0 L145.2,148.1 L144.6,151.3 L137.2,153.1 L139.2,156.2 L136.9,158.3 L129.1,158.4 L134.0,160.8 L129.6,164.4 L126.6,171.4 L144.4,179.8 L139.4,185.1 L146.1,189.9 L139.6,196.1 L139.9,197.4 L128.9,210.1 L138.6,223.5 L131.3,234.5 L119.5,242.8 L118.6,244.7 L120.8,244.8 L117.6,253.4 L118.5,254.6 L118.2,257.0 L102.8,263.9 L92.6,278.5 L89.4,273.1 L81.6,268.7 L77.2,270.5 L67.1,268.7 L61.8,265.6 L59.3,255.9 L51.9,251.2 L46.9,245.8 L46.6,241.9 L48.2,239.3 L59.1,231.4 L61.6,227.0 L61.1,222.3 L54.8,223.6 L36.5,209.7 L13.9,206.7 L8.0,200.0Z","cx":83.7,"cy":197.9},"12":{"d":"M260.1,132.8 L269.3,120.4 L268.9,117.3 L265.7,117.8 L268.9,112.3 L272.1,111.3 L272.7,107.1 L271.9,84.3 L272.9,79.4 L283.3,75.0 L292.2,72.9 L294.3,70.9 L296.5,64.9 L298.6,64.3 L298.2,62.4 L304.8,63.5 L308.3,59.6 L308.6,67.5 L307.7,70.0 L308.8,81.4 L308.4,84.4 L305.7,87.8 L306.7,90.0 L344.8,103.6 L364.7,108.1 L364.6,109.2 L361.8,108.8 L356.4,122.4 L362.2,124.9 L358.8,133.1 L364.7,135.8 L362.5,142.2 L358.1,140.5 L355.3,144.0 L350.8,140.9 L343.3,145.1 L345.0,147.9 L347.2,148.8 L341.3,155.1 L334.0,158.7 L330.7,169.0 L331.0,171.6 L328.8,173.1 L328.2,172.5 L329.2,170.3 L322.2,160.6 L320.1,159.7 L319.3,162.4 L311.8,164.8 L296.6,159.5 L288.7,149.4 L283.0,145.3 L274.2,135.2 L269.4,133.8 L262.7,135.8 L260.1,132.8Z","cx":313.4,"cy":114.8}}};

// ---------- Sprache ----------
const LS_LANG = 'gf-lang';
let lang = (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'de';
try { const s = localStorage.getItem(LS_LANG); if (s === 'de' || s === 'en') lang = s; } catch {}

const T = {
  de: {
    info: 'Info', share: 'Teilen', accept: 'Übernehmen', noThanks: 'Nein danke',
    whereTitle: 'Wo?', cravingTitle: 'Heute habe ich Lust auf', wishTitle: 'Mir ist wichtig:', reset: 'Zurücksetzen',
    wishHint: 'Punkt anklicken oder entlang der Achse ziehen: 1 tief … 5 hoch. «egal» = wird nicht gewertet. Schick und Günstig schliessen sich aus.',
    trustTitle: 'Wem vertraue ich?', proto: 'Prototyp:', protoHint: 'Die Influencer-Bewertungen sind simuliert und stammen nicht von den Personen selbst.',
    hitsTitle: 'Deine Treffer', save: 'Sichern', load: 'Laden',
    hitsHint: 'Sortiert nach Passung zu deinem Wunsch. Antippen legt das Restaurant über das Netz. Mit ✎ bewertest du selbst – deine Bewertung zählt dann vor allen anderen.',
    removeOwn: 'Eigene Bewertung entfernen', cancel: 'Abbrechen', saveBtn: 'Speichern', letsGo: 'Los geht\'s',
    allCity: 'Ganz {city}', kreis: 'Kreis', kreise: 'Kreise', allKreise: 'Alle Kreise', lake: 'Zürichsee',
    surprise: 'Überrasch mich', place: 'Lokal', places: 'Lokale', dots: '…',
    egal: 'egal', setEgal: '{x} auf egal gesetzt', wishReset: 'Wunschprofil zurückgesetzt', myWish: 'Mein Wunsch', yourRating: 'deine Bewertung', hide: 'Ausblenden',
    ignore: 'Ist mir egal', reactivate: 'Wieder werten', change: 'ändern',
    optAll: 'Alle (Durchschnitt aller {n} Stimmen)', optMine: 'Meine Liste', empty: 'noch leer', allVoices: 'Alle Stimmen',
    mineBio: 'Nur Lokale, die du selbst bewertet hast.',
    listEmptyMine: 'Deine Liste ist noch leer. Bewerte ein Lokal mit ✎.', listEmptyArt: 'Kein Lokal für diese Auswahl.', loading: 'Daten werden geladen …',
    rateSelf: 'Selbst bewerten', changeRating: 'Deine Bewertung ändern', rateTitle: '{name} selbst bewerten', rateHint: 'Deine Bewertung ersetzt die des Gastroführers (1 tief … 5 hoch)',
    ownRemoved: 'Eigene Bewertung entfernt', ownSaved: 'Deine Bewertung für «{name}» gespeichert',
    linkCopied: 'Link kopiert – einfach weiterschicken', shareLink: 'Link zum Teilen:', shareBad: 'Geteilter Link konnte nicht gelesen werden',
    shareText: 'Jemand hat dir eine Auswahl geschickt: Wunschprofil{art}, {n} eigene Bewertungen.', shareTaken: 'Auswahl übernommen',
    saved: 'Gesichert', loaded: 'Geladen', badFile: 'Datei konnte nicht gelesen werden: ', noData: 'restaurants.json nicht gefunden', jump: 'Treffer ansehen ↓',
    labels: ['Schick', 'Ambiente', 'Weinkarte', 'Essen', 'Sehen und gesehen werden', 'Günstig', 'Service'],
    short: ['Schick', 'Ambiente', 'Wein', 'Essen', 'Gesehen werden', 'Günstig', 'Service'],
    arten: { 'Schweizerisch': 'Schweizerisch', 'Italienisch': 'Italienisch', 'Französisch': 'Französisch', 'Spanisch': 'Spanisch', 'Griechisch': 'Griechisch', 'Japanisch': 'Japanisch', 'Chinesisch': 'Chinesisch', 'Thailändisch': 'Thailändisch', 'Vietnamesisch': 'Vietnamesisch', 'Indisch': 'Indisch', 'Mexikanisch': 'Mexikanisch', 'Vegetarisch/Vegan': 'Vegetarisch/Vegan', 'Steakhouse': 'Steakhouse', 'Fisch': 'Fisch' },
    gfName: 'Gastroführer', gfHandle: 'Haus-Rating'
  },
  en: {
    info: 'About', share: 'Share', accept: 'Apply', noThanks: 'No thanks',
    whereTitle: 'Where?', cravingTitle: 'Today I feel like', wishTitle: 'What matters to me:', reset: 'Reset',
    wishHint: 'Tap a point or drag along an axis: 1 low … 5 high. "skip" = not counted. Fancy and Cheap are mutually exclusive.',
    trustTitle: 'Whose ratings do I trust?', proto: 'Prototype:', protoHint: 'Influencer ratings are simulated and do not come from the people themselves.',
    hitsTitle: 'Your matches', save: 'Backup', load: 'Restore',
    hitsHint: 'Sorted by how well they match your wishes. Tap a place to overlay it on the chart. Use ✎ to rate it yourself – your rating then counts above all others.',
    removeOwn: 'Remove my rating', cancel: 'Cancel', saveBtn: 'Save', letsGo: 'Let\'s go',
    allCity: 'All of {city}', kreis: 'District', kreise: 'districts', allKreise: 'All districts', lake: 'Lake Zurich',
    surprise: 'Surprise me', place: 'place', places: 'places', dots: '…',
    egal: 'skip', setEgal: '{x} set to skip', wishReset: 'Wishes reset', myWish: 'My wishes', yourRating: 'your rating', hide: 'Hide',
    ignore: 'Skip this', reactivate: 'Count again', change: 'change',
    optAll: 'Everyone (average of all {n} voices)', optMine: 'My list', empty: 'still empty', allVoices: 'All voices',
    mineBio: 'Only places you have rated yourself.',
    listEmptyMine: 'Your list is still empty. Rate a place with ✎.', listEmptyArt: 'No place for this selection.', loading: 'Loading data …',
    rateSelf: 'Rate it yourself', changeRating: 'Change your rating', rateTitle: 'Rate {name}', rateHint: 'Your rating replaces the guide\'s rating (1 low … 5 high)',
    ownRemoved: 'Your rating was removed', ownSaved: 'Your rating for "{name}" was saved',
    linkCopied: 'Link copied – just send it on', shareLink: 'Link to share:', shareBad: 'The shared link could not be read',
    shareText: 'Someone sent you a selection: wishes{art}, {n} own ratings.', shareTaken: 'Selection applied',
    saved: 'Saved', loaded: 'Restored', badFile: 'Could not read file: ', noData: 'restaurants.json not found', jump: 'See matches ↓',
    labels: ['Fancy', 'Ambience', 'Wine list', 'Food', 'See and be seen', 'Cheap', 'Service'],
    short: ['Fancy', 'Ambience', 'Wine', 'Food', 'Be seen', 'Cheap', 'Service'],
    arten: { 'Schweizerisch': 'Swiss', 'Italienisch': 'Italian', 'Französisch': 'French', 'Spanisch': 'Spanish', 'Griechisch': 'Greek', 'Japanisch': 'Japanese', 'Chinesisch': 'Chinese', 'Thailändisch': 'Thai', 'Vietnamesisch': 'Vietnamese', 'Indisch': 'Indian', 'Mexikanisch': 'Mexican', 'Vegetarisch/Vegan': 'Vegetarian/Vegan', 'Steakhouse': 'Steakhouse', 'Fisch': 'Seafood' },
    gfName: 'Gastroführer', gfHandle: 'House rating'
  }
};
function t(key, vars) {
  let s = (T[lang] && T[lang][key]) ?? T.de[key] ?? key;
  if (vars) for (const k in vars) s = s.replaceAll('{' + k + '}', vars[k]);
  return s;
}
function artName(a) { return (T[lang].arten && T[lang].arten[a]) || a; }
function applyLangStatic() {
  document.documentElement.lang = lang === 'en' ? 'en' : 'de-CH';
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('.lang-switch button').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));
  document.getElementById('jump').textContent = t('jump');
}
document.querySelectorAll('.lang-switch button').forEach(b => b.addEventListener('click', () => {
  lang = b.dataset.lang; try { localStorage.setItem(LS_LANG, lang); } catch {}
  applyLangStatic(); render();
  if (document.getElementById('intro').open) drawIntro();
}));

// ---------- Konstanten ----------
const N = 7, LEVELS = 5, DEFAULT_VALUE = 3;
const EXCLUSIVE = [[0, 5]]; // Schick <-> Günstig
function partnerOf(i) { for (const [a, b] of EXCLUSIVE) { if (i === a) return b; if (i === b) return a; } return -1; }
const EMOJI = { 'Schweizerisch': '🫕', 'Italienisch': '🍝', 'Französisch': '🥐', 'Spanisch': '🥘', 'Griechisch': '🫒', 'Japanisch': '🍣', 'Chinesisch': '🥟', 'Thailändisch': '🌶️', 'Vietnamesisch': '🍜', 'Indisch': '🍛', 'Mexikanisch': '🌮', 'Vegetarisch/Vegan': '🥗', 'Steakhouse': '🥩', 'Fisch': '🐟' };
const ART_ORDER = Object.keys(EMOJI);

// Städte und Kreise (schematische Karte). Positionen in der 440×400-viewBox.
const CITIES = { 'Zürich': ZH_MAP };

const LS_THEME = 'gf-theme', LS_WISH = 'gf-wunsch', LS_ART = 'gf-art', LS_OWN = 'gf-own', LS_KUR = 'gf-kuratoren', LS_CITY = 'gf-city', LS_KREIS = 'gf-kreise', LS_INTRO = 'gf-intro';

// Kuratoren (eingebaut; kuratoren.json überschreibt, falls vorhanden)
const DEFAULT_CURATORS = [
  { id: 'gf', name: 'Gastroführer', handle: 'Haus-Rating', url: '', bio: 'Das offizielle Rating dieses Gastroführers.', bio_en: 'The official rating of this guide.', farbe: '#1f6fe0' },
  { id: 'harrysding', name: "Harry's Ding", handle: '@harrysding', url: 'https://www.instagram.com/harrysding', bio: 'Harry H. Meier & Carrie Meier-Ho – seit 2008 Zürichs bekanntester Food-Blog.', bio_en: "Harry H. Meier & Carrie Meier-Ho – Zurich's best-known food blog since 2008.", farbe: '#e0561f' },
  { id: 'zueriplausch', name: 'Züriplausch', handle: '@zueriplausch', url: 'https://www.instagram.com/zueriplausch/', bio: 'Sarah Blattner – «einfach essen gehen», vom Beizli bis Fine Dining.', bio_en: 'Sarah Blattner – "just go eat", from corner pubs to fine dining.', farbe: '#1fa05a' },
  { id: 'zurichfoodadvisor', name: 'Zurich Food Advisor', handle: '@zurichfoodadvisor', url: 'https://www.instagram.com/zurichfoodadvisor/', bio: 'Mariam Nemati – Trends, neue Orte, glamourös.', bio_en: 'Mariam Nemati – trends, new places, glamorous.', farbe: '#a23fd9' },
  { id: 'eatwithan', name: 'Eat with An', handle: '@eatwith_an', url: 'https://www.instagram.com/eatwith_an/', bio: 'Restaurant- und Pop-up-Tipps, Schwerpunkt asiatische Küche.', bio_en: 'Restaurant and pop-up tips, focus on Asian cuisine.', farbe: '#d9a21f' },
  { id: 'thuja', name: 'Thuja Leo', handle: '@thuja_leo', url: 'https://www.instagram.com/thuja_leo', bio: 'Swiss Influencer Award Food 2024 – hippe Lokale, Streetfood, Burger, Pizza.', bio_en: 'Swiss Influencer Award Food 2024 – hip places, street food, burgers, pizza.', farbe: '#1fb2c9' },
  { id: 'anaundnina', name: 'Ana und Nina', handle: '@anaundnina', url: 'https://www.instagram.com/anaundnina/', bio: 'Anastasia Lammer – Rezepte, Reisen, Restaurantbesuche.', bio_en: 'Anastasia Lammer – recipes, travel, restaurant visits.', farbe: '#c92f6b' },
  { id: 'jasminedecker', name: 'Jasmine Decker', handle: '@jasminea.decker', url: 'https://www.instagram.com/jasminea.decker/', bio: 'Englischsprachig, beliebt bei Expats – Ausflüge und Kulinarik rund um Zürich.', bio_en: 'English-speaking, popular with expats – trips and food around Zurich.', farbe: '#6b7cff' },
  { id: 'rabona', name: 'Rabona', handle: '@heyrabona', url: 'https://www.instagram.com/heyrabona/', bio: 'Streetfood und währschafte Küche, Zürich und ganze Schweiz.', bio_en: 'Street food and hearty cooking, Zurich and all of Switzerland.', farbe: '#ff7a3d' },
  { id: 'aninipanini', name: 'Anini Panini', handle: '@anini_paninii', url: 'https://www.tiktok.com/@anini_paninii', bio: 'Lockere Entdeckungsreisen vom Burgerschuppen bis zum Bistro – oft mit Nonno.', bio_en: 'Laid-back discoveries from burger joints to bistros – often with Nonno.', farbe: '#2fbf8f' },
  { id: 'zurichfood', name: 'Zürich Food', handle: '@zurich.food', url: 'https://www.instagram.com/zurich.food/', bio: 'Laura & Eva – Foodblog mit Zürcher Restaurant-Tipps.', bio_en: 'Laura & Eva – food blog with Zurich restaurant tips.', farbe: '#b8763a' }
];
let curators = DEFAULT_CURATORS;

// ---------- Zustand ----------
let base = [];
let wish = loadJSON(LS_WISH, null); if (!Array.isArray(wish) || wish.length !== N) wish = Array(N).fill(DEFAULT_VALUE);
let own = loadJSON(LS_OWN, {}); if (!own || typeof own !== 'object') own = {};
let selKur = loadJSON(LS_KUR, []); if (!Array.isArray(selKur)) selKur = [];
let artFilter = ''; try { artFilter = localStorage.getItem(LS_ART) || ''; } catch {}
let city = 'Zürich'; try { city = localStorage.getItem(LS_CITY) || 'Zürich'; } catch {} if (!CITIES[city]) city = 'Zürich';
let kreise = loadJSON(LS_KREIS, []); if (!Array.isArray(kreise)) kreise = []; // [] = alle
let selectedId = null, pendingShare = null, kurOpen = false;
const MINE = 'mine';

function loadJSON(k, fb) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } }
function save() {
  try {
    localStorage.setItem(LS_WISH, JSON.stringify(wish)); localStorage.setItem(LS_OWN, JSON.stringify(own));
    localStorage.setItem(LS_ART, artFilter); localStorage.setItem(LS_KUR, JSON.stringify(selKur));
    localStorage.setItem(LS_CITY, city); localStorage.setItem(LS_KREIS, JSON.stringify(kreise));
  } catch {}
}

// ---------- Theme ----------
function applyTheme(th) { document.documentElement.setAttribute('data-theme', th); try { localStorage.setItem(LS_THEME, th); } catch {} }
(function () { let th = null; try { th = localStorage.getItem(LS_THEME); } catch {} if (!th) th = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; document.documentElement.setAttribute('data-theme', th); })();
document.getElementById('btn-theme').addEventListener('click', () => applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

// ---------- Hilfen ----------
function toast(msg) { const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; document.getElementById('toasts').appendChild(el); setTimeout(() => el.remove(), 2400); }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
function hash(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function initials(n) { return n.split(/[\s']+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join(''); }

function inCity(r) { return (r.stadt || 'Zürich') === city; }
function inKreis(r) { return !kreise.length || kreise.includes(r.kreis); }
function isMineList() { return selKur.length === 1 && selKur[0] === MINE; }
function curatorValues(k, r) {
  if (k.id === 'gf') return r.values;
  return r.values.map((v, i) => { const x = hash(k.id + '|' + r.id + '|' + i) % 10; const d = x < 2 ? -1 : x > 7 ? 1 : 0; return Math.max(1, Math.min(LEVELS, v + d)); });
}
function activeCurators() { const sel = curators.filter(k => selKur.includes(k.id)); return sel.length ? sel : curators; }
function effectiveValues(r) {
  if (own[r.id]) return own[r.id];
  const ks = activeCurators(), sum = Array(N).fill(0);
  ks.forEach(k => curatorValues(k, r).forEach((v, i) => { sum[i] += v; }));
  return sum.map(s => Math.round((s / ks.length) * 10) / 10);
}
function score(values) {
  let sum = 0, n = 0;
  for (let i = 0; i < N; i++) { if (wish[i] === null) continue; const v = values?.[i]; if (typeof v !== 'number') continue; sum += Math.abs(wish[i] - v); n++; }
  return n ? Math.round(100 * (1 - sum / (n * (LEVELS - 1)))) : null;
}

// ---------- 1 Ort + Kreise ----------
function drawPlace() {
  const sel = document.getElementById('sel-city');
  sel.innerHTML = Object.keys(CITIES).map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  sel.value = city;
  const C = CITIES[city];
  const svgm = document.getElementById('kreis-map');
  svgm.setAttribute('viewBox', `0 0 ${C.W} ${C.H}`);
  const counts = {}; base.filter(inCity).filter(r => !artFilter || r.art === artFilter).forEach(r => { counts[r.kreis] = (counts[r.kreis] || 0) + 1; });
  const NS = 'http://www.w3.org/2000/svg';
  svgm.innerHTML = '';
  const mk = (tag, attrs, parent) => { const el = document.createElementNS(NS, tag); for (const k in attrs) el.setAttribute(k, attrs[k]); (parent || svgm).appendChild(el); return el; };
  if (C.lake) mk('path', { class: 'water', d: C.lake });
  const ids = Object.keys(C.k).map(Number).sort((a, b) => a - b);
  for (const n of ids) {
    const k = C.k[n]; const on = kreise.includes(n), dim = kreise.length && !on;
    const g = mk('g', { class: 'k' + (on ? ' on' : '') + (dim ? ' dim' : ''), tabindex: 0, role: 'button', 'aria-pressed': on });
    mk('title', {}, g).textContent = `${t('kreis')} ${n} · ${counts[n] || 0} ${t('places')}`;
    mk('path', { d: k.d }, g);
    const toggle = () => { kreise = on ? kreise.filter(x => x !== n) : [...kreise, n]; if (kreise.length === ids.length) kreise = []; save(); render(); };
    g.addEventListener('click', toggle);
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
  }
  // Beschriftung zuletzt (über den Flächen)
  for (const n of ids) {
    const k = C.k[n]; const on = kreise.includes(n);
    const g = mk('g', { class: 'lbl' + (on ? ' on' : '') });
    mk('text', { class: 'num', x: k.cx, y: k.cy + 1 }, g).textContent = n;
    mk('text', { class: 'cnt', x: k.cx, y: k.cy + 14 }, g).textContent = counts[n] || 0;
  }
  if (C.lake) { const lt = mk('text', { class: 'lakelabel', x: 268, y: 330, transform: 'rotate(62 268 330)' }); lt.textContent = t('lake'); }
  // Chips: Alle + gewählte
  const chips = document.getElementById('kreis-chips');
  chips.innerHTML = '';
  const all = document.createElement('button'); all.className = 'chip' + (kreise.length ? '' : ' active'); all.textContent = t('allCity', { city });
  all.addEventListener('click', () => { kreise = []; save(); render(); }); chips.appendChild(all);
  [...kreise].sort((a, b) => a - b).forEach(n => {
    const c = document.createElement('button'); c.className = 'chip active'; c.textContent = `${t('kreis')} ${n} ✕`;
    c.addEventListener('click', () => { kreise = kreise.filter(x => x !== n); save(); render(); }); chips.appendChild(c);
  });
  document.getElementById('place-sub').textContent = kreise.length ? `${city} · ${t('kreis')} ${[...kreise].sort((a, b) => a - b).join(', ')}` : t('allCity', { city });
}
document.getElementById('sel-city').addEventListener('change', e => { city = e.target.value; kreise = []; save(); render(); });

// ---------- 2 Art ----------
function drawTiles() {
  const box = document.getElementById('tiles'); box.innerHTML = '';
  const pool = base.filter(inCity);
  const counts = {}; pool.forEach(r => { counts[r.art] = (counts[r.art] || 0) + 1; });
  const arts = [...ART_ORDER, ...[...new Set(pool.map(r => r.art))].filter(a => !ART_ORDER.includes(a)).sort()];
  const mk = (art, label, emoji, count) => {
    const b = document.createElement('button');
    b.className = 'tile' + (artFilter === art ? ' active' : '');
    b.innerHTML = `<span class="emoji">${emoji}</span><span class="name">${esc(label)}</span><span class="count">${count} ${count === 1 ? t('place') : t('places')}</span>`;
    b.addEventListener('click', () => { artFilter = art; save(); render(); document.getElementById('step-place').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    box.appendChild(b);
  };
  mk('', t('surprise'), '🎲', pool.length);
  arts.forEach(a => mk(a, artName(a), EMOJI[a] || '🍽️', counts[a] || 0));
  document.getElementById('art-word').textContent = artFilter ? artName(artFilter) : t('dots');
}

// ---------- 3 Netz ----------
const svg = document.getElementById('radar');
let CX = 410; const CY = 320; let R = 235, LABEL_R = R + 36;
function isMobile() { return window.innerWidth <= 600; }
function geo() {
  const m = isMobile();
  R = m ? 215 : 235; LABEL_R = R + (m ? 30 : 36); CX = m ? 340 : 410;
  svg.setAttribute('viewBox', m ? '0 0 680 640' : '0 0 820 640');
  return { m, W: m ? 64 : 40, H: m ? 28 : 18, stepR: m ? 8 : 5, dotR: m ? 10 : 7, hit: m ? 40 : 26 };
}
function angle(i) { return -Math.PI / 2 + (2 * Math.PI * i) / N; }
function point(i, level) { const r = (R * level) / LEVELS, a = angle(i); return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; }
function svgEl(tag, attrs = {}, parent) { const el = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) el.setAttribute(k, attrs[k]); if (parent) parent.appendChild(el); return el; }
function drawRadar() {
  svg.innerHTML = '';
  const G = geo(); const L = T[lang].labels, S = T[lang].short;
  for (let l = 1; l <= LEVELS; l++) {
    const pts = []; for (let i = 0; i < N; i++) pts.push(point(i, l).join(','));
    svgEl('polygon', { class: 'ring', points: pts.join(' ') }, svg);
    const [x, y] = point(0, l); svgEl('text', { class: 'level-num', x: x + 6, y: y + 4 }, svg).textContent = l;
  }
  for (let i = 0; i < N; i++) {
    const off = wish[i] === null; const [x, y] = point(i, LEVELS);
    svgEl('line', { class: 'axis' + (off ? ' off' : ''), x1: CX, y1: CY, x2: x, y2: y }, svg);
    svgEl('line', { class: 'axis-hit', x1: CX, y1: CY, x2: x, y2: y, 'data-axis': i, 'stroke-width': G.hit }, svg).addEventListener('pointerdown', onAxisPointerDown);
    for (let l = 1; l <= LEVELS; l++) { const [sx, sy] = point(i, l); svgEl('circle', { class: 'step-pt' + (off ? ' off' : ''), cx: sx, cy: sy, r: G.stepR, 'data-axis': i, 'data-level': l }, svg).addEventListener('pointerdown', onAxisPointerDown); }
    const a = angle(i), cos = Math.cos(a), sin = Math.sin(a);
    const anchor = Math.abs(cos) < 0.15 ? 'middle' : cos > 0 ? 'start' : 'end';
    const W = G.W, H = G.H;
    const lx = CX + LABEL_R * cos, ly = CY + LABEL_R * sin + 5 - (sin < -0.05 ? H + 10 : 0);
    const tx = svgEl('text', { class: 'label' + (off ? ' off' : ''), x: lx, y: ly, 'text-anchor': anchor }, svg);
    tx.textContent = G.m ? S[i] : L[i]; tx.addEventListener('click', () => toggleOff(i));
    const by = ly + 8, bx = anchor === 'start' ? lx : anchor === 'end' ? lx - W : lx - W / 2;
    const g = svgEl('g', { class: 'egal-btn' + (off ? ' on' : '') }, svg);
    svgEl('title', {}, g).textContent = off ? t('reactivate') : t('ignore');
    svgEl('rect', { x: bx, y: by, width: W, height: H, rx: 9 }, g);
    svgEl('text', { x: bx + W / 2, y: by + H * 0.72, 'text-anchor': 'middle' }, g).textContent = t('egal');
    g.addEventListener('click', () => toggleOff(i));
  }
  const sel = base.find(r => r.id === selectedId);
  if (sel) drawPoly(effectiveValues(sel), own[sel.id] ? cssVar('--own') : cssVar('--rest'), false);
  drawPoly(wish, cssVar('--wish'), true);
}
function drawPoly(values, col, isWish) {
  const pts = []; for (let i = 0; i < N; i++) if (typeof values[i] === 'number') pts.push(point(i, values[i]));
  if (pts.length >= 2) svgEl(pts.length >= 3 ? 'polygon' : 'polyline', { class: 'poly' + (isWish ? '' : ' rest'), points: pts.map(q => q.join(',')).join(' '), fill: col, stroke: col }, svg);
  for (let i = 0; i < N; i++) {
    if (typeof values[i] !== 'number') continue; const [dx, dy] = point(i, values[i]);
    const d = svgEl('circle', { class: 'dot' + (isWish ? ' wish' : ''), cx: dx, cy: dy, r: isWish ? geo().dotR : 4, fill: col, stroke: 'var(--card)', 'stroke-width': isWish ? 2 : 1, 'data-axis': i }, svg);
    if (isWish) d.addEventListener('pointerdown', onAxisPointerDown);
  }
}
let drag = null;
function svgPoint(evt) { const pt = svg.createSVGPoint(); pt.x = evt.clientX; pt.y = evt.clientY; const p = pt.matrixTransform(svg.getScreenCTM().inverse()); return [p.x, p.y]; }
function levelFromPointer(axis, evt) { const [px, py] = svgPoint(evt), a = angle(axis); const proj = (px - CX) * Math.cos(a) + (py - CY) * Math.sin(a); return Math.max(1, Math.min(LEVELS, Math.round((proj / R) * LEVELS))); }
function onAxisPointerDown(evt) {
  evt.preventDefault(); const axis = +evt.currentTarget.dataset.axis; const explicit = evt.currentTarget.dataset.level;
  const level = explicit ? +explicit : levelFromPointer(axis, evt);
  setWish(axis, level, false); drag = { axis, last: level }; svg.setPointerCapture?.(evt.pointerId);
}
svg.addEventListener('pointermove', evt => { if (!drag) return; const l = levelFromPointer(drag.axis, evt); if (l !== drag.last) { drag.last = l; setWish(drag.axis, l, false); } });
function endDrag() { if (drag) { drag = null; save(); } }
svg.addEventListener('pointerup', endDrag); svg.addEventListener('pointercancel', endDrag);
function setWish(axis, level, persist = true) {
  wish[axis] = level; const p = partnerOf(axis);
  if (p >= 0 && wish[p] !== null) { wish[p] = null; if (persist) toast(t('setEgal', { x: T[lang].labels[p] })); }
  if (persist) save(); render();
}
function toggleOff(axis) {
  if (wish[axis] === null) { wish[axis] = DEFAULT_VALUE; const p = partnerOf(axis); if (p >= 0 && wish[p] !== null) { wish[p] = null; toast(t('setEgal', { x: T[lang].labels[p] })); } }
  else wish[axis] = null;
  save(); render();
}
document.getElementById('btn-reset').addEventListener('click', () => { wish = Array(N).fill(DEFAULT_VALUE); save(); render(); toast(t('wishReset')); });
function drawOverlayInfo() {
  const box = document.getElementById('overlay-info'); const sel = base.find(r => r.id === selectedId);
  box.innerHTML = `<span><span class="swatch" style="background:${cssVar('--wish')}"></span>${t('myWish')}</span>`;
  if (sel) {
    const isOwn = !!own[sel.id], s = score(effectiveValues(sel));
    box.innerHTML += `<span><span class="swatch dash" style="background:${isOwn ? cssVar('--own') : cssVar('--rest')}"></span>${esc(sel.name)}${isOwn ? ' (' + t('yourRating') + ')' : ''}${s === null ? '' : ' · ' + s + ' %'}</span><button class="btn small" id="btn-clear-overlay">${t('hide')}</button>`;
    box.querySelector('#btn-clear-overlay').addEventListener('click', () => { selectedId = null; kurOpen = false; render(); });
  }
  // Detail unter dem Netz
  const det = document.getElementById('rest-detail');
  if (sel) {
    const isOwn = !!own[sel.id], s = score(effectiveValues(sel));
    const meta = [artName(sel.art), sel.quartier ? `${sel.quartier} (${t('kreis')} ${sel.kreis})` : sel.ort].filter(Boolean).map(esc).join(' · ');
    det.innerHTML = `${ringSVG(s)}<div><div class="name">${esc(sel.name)}${isOwn ? `<span class="badge own">${t('yourRating')}</span>` : ''}</div><div class="meta">${meta}${sel.link ? ' · ' + `<a href="${esc(sel.link)}" target="_blank" rel="noopener">Link</a>` : ''}</div>${sel.note ? `<div class="note">${esc(sel.note)}</div>` : ''}${isOwn ? barsHTML(own[sel.id], 'own') : barsHTML(effectiveValues(sel), '')}</div><div class="actions"><button class="btn small" id="det-rate">✎ ${isOwn ? t('changeRating') : t('rateSelf')}</button><button class="btn small" id="det-close">${t('hide')}</button></div>`;
    det.hidden = false;
    det.querySelector('#det-rate').addEventListener('click', () => openDialog(sel));
    det.querySelector('#det-close').addEventListener('click', () => { selectedId = null; render(); });
  } else det.hidden = true;
  // Kuratoren einklappen, solange ein Restaurant offen ist
  const collapsed = !!sel && !kurOpen;
  document.getElementById('kur-card').hidden = collapsed;
  document.getElementById('kur-collapsed').hidden = !collapsed;
}

// ---------- 4 Kuratoren ----------
function drawCurators() {
  const sel = document.getElementById('sel-kur');
  const allActive = selKur.length === 0, mineActive = isMineList();
  const nMine = Object.keys(own).length;
  const kname = k => k.id === 'gf' ? t('gfName') : k.name, khandle = k => k.id === 'gf' ? t('gfHandle') : k.handle, kbio = k => (lang === 'en' && k.bio_en) || k.bio || '';
  sel.innerHTML = `<option value="">${t('optAll', { n: curators.length })}</option><option value="${MINE}">${t('optMine')} (${nMine ? nMine + ' ' + t('places') : t('empty')})</option>` +
    curators.map(k => `<option value="${esc(k.id)}">${esc(kname(k))} – ${esc(khandle(k))}</option>`).join('');
  sel.value = allActive ? '' : mineActive ? MINE : (selKur[0] || '');
  const info = document.getElementById('kur-info');
  const k = allActive || mineActive ? null : curators.find(x => x.id === selKur[0]);
  if (k) { info.style.setProperty('--kc', k.farbe || 'var(--accent)'); info.innerHTML = `<span class="avatar">${esc(initials(k.name))}</span><span><span class="kname">${esc(kname(k))}</span>${k.url ? ` · <a href="${esc(k.url)}" target="_blank" rel="noopener">${esc(k.handle)}</a>` : ''}<br><span class="kbio">${esc(kbio(k))}</span></span>`; info.hidden = false; }
  else if (mineActive) { info.style.setProperty('--kc', 'var(--own)'); info.innerHTML = `<span class="avatar">★</span><span><span class="kname">${t('optMine')}</span><br><span class="kbio">${t('mineBio')}</span></span>`; info.hidden = false; }
  else info.hidden = true;
  const subTxt = allActive ? t('allVoices') : mineActive ? t('optMine') : (k ? kname(k) : '');
  document.getElementById('kur-sub').textContent = subTxt;
  document.getElementById('kur-expand').textContent = `${subTxt} · ${t('change')}`;
}
document.getElementById('kur-expand').addEventListener('click', () => { kurOpen = true; render(); });
document.getElementById('sel-kur').addEventListener('change', e => { const v = e.target.value; selKur = v === '' ? [] : [v]; save(); render(); });

// ---------- 5 Ranking ----------
function ringSVG(s) { const r = 24, c = 2 * Math.PI * r, off = s === null ? c : c * (1 - s / 100); return `<svg class="ring" viewBox="0 0 58 58"><circle class="track" cx="29" cy="29" r="${r}"/><circle class="val" cx="29" cy="29" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${off}"/><text x="29" y="29">${s === null ? '–' : s}</text></svg>`; }
function barsHTML(values, cls) { const L = T[lang].labels; return `<div class="bars ${cls}" title="${L.map((l, i) => l + ': ' + (values[i] ?? '–')).join(', ')}">` + values.map((v, i) => `<i class="${wish[i] === null ? 'off' : ''}" style="height:${(v / LEVELS) * 100}%"></i>`).join('') + '</div>'; }
function drawList() {
  const box = document.getElementById('rest-list'); box.innerHTML = '';
  const rows = base.filter(inCity).filter(inKreis).filter(r => !artFilter || r.art === artFilter).filter(r => !isMineList() || own[r.id])
    .map(r => ({ r, s: score(effectiveValues(r)) })).sort((a, b) => (b.s ?? -1) - (a.s ?? -1) || a.r.name.localeCompare(b.r.name, 'de'));
  document.getElementById('rest-count').textContent = `${rows.length} ${t('places')}${artFilter ? ' · ' + artName(artFilter) : ''}`;
  if (!rows.length) { box.innerHTML = `<div class="empty">${isMineList() ? t('listEmptyMine') : base.length ? t('listEmptyArt') : t('loading')}</div>`; return; }
  rows.forEach(({ r, s }, idx) => {
    const isOwn = !!own[r.id]; const div = document.createElement('div');
    div.className = 'row' + (r.id === selectedId ? ' selected' : ''); div.tabIndex = 0;
    const meta = [artName(r.art), r.quartier ? `${r.quartier} (${t('kreis')} ${r.kreis})` : r.ort].filter(Boolean).map(esc).join(' · ');
    div.innerHTML = `<div class="rank r${idx + 1}">${idx + 1}</div>${ringSVG(s)}<div><div class="name">${esc(r.name)}${isOwn ? `<span class="badge own">${t('yourRating')}</span>` : ''}</div><div class="meta">${meta}${r.link ? ' · ' + `<a href="${esc(r.link)}" target="_blank" rel="noopener">Link</a>` : ''}</div>${r.note ? `<div class="meta">${esc(r.note)}</div>` : ''}${isOwn ? barsHTML(own[r.id], 'own') : barsHTML(effectiveValues(r), '')}</div><div class="actions"><button class="btn small icon" data-rate title="${isOwn ? t('changeRating') : t('rateSelf')}">✎</button></div>`;
    div.addEventListener('click', e => { if (e.target.closest('a,button')) return; selectedId = selectedId === r.id ? null : r.id; kurOpen = false; render(); if (selectedId) document.getElementById('step-wish').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    div.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); div.click(); } });
    div.querySelector('[data-rate]').addEventListener('click', () => openDialog(r));
    box.appendChild(div);
  });
}

// ---------- Dialog: eigene Bewertung ----------
const dlg = document.getElementById('dlg'); let dlgValues = Array(N).fill(DEFAULT_VALUE), dlgTarget = null;
function openDialog(r) {
  dlgTarget = r;
  document.getElementById('dlg-title').textContent = t('rateTitle', { name: r.name });
  document.getElementById('rating-hint').textContent = t('rateHint');
  const src = own[r.id] || r.values; dlgValues = [...src];
  document.getElementById('dlg-remove-own').hidden = !own[r.id];
  drawRatingRows(); dlg.showModal();
}
function drawRatingRows() {
  const box = document.getElementById('rating-rows'); box.innerHTML = '';
  T[lang].labels.forEach((lab, i) => {
    const row = document.createElement('div'); row.className = 'rating-row'; row.innerHTML = `<span>${esc(lab)}</span><span class="vals"></span>`;
    const vals = row.querySelector('.vals');
    for (let l = 1; l <= LEVELS; l++) { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn small' + (dlgValues[i] === l ? ' active' : ''); b.textContent = l; b.addEventListener('click', () => { dlgValues[i] = l; drawRatingRows(); }); vals.appendChild(b); }
    box.appendChild(row);
  });
}
document.getElementById('dlg-cancel').addEventListener('click', () => dlg.close());
document.getElementById('dlg-remove-own').addEventListener('click', () => { if (dlgTarget) { delete own[dlgTarget.id]; save(); render(); toast(t('ownRemoved')); } dlg.close(); });
document.getElementById('dlg-save').addEventListener('click', () => { own[dlgTarget.id] = [...dlgValues]; toast(t('ownSaved', { name: dlgTarget.name })); dlg.close(); save(); render(); });

// ---------- Intro-Popup ----------
const INTRO = {
  de: `
<h1>Heute Lust auf …?</h1>
<p class="lead">Der Gastroführer, der fragt, worauf du Lust hast – nicht, wo du gerade bist.</p>
<h2>Wieso noch ein Gastroführer?</h2>
<p>Weil es keinen praktischen gibt.</p>
<ul>
<li><strong>Tripadvisor</strong> ist eine Wand aus Sternen und Touristen-Kommentaren. Wer in Zürich lebt, findet dort nichts.</li>
<li><strong>Michelin und Gault-Millau</strong> wissen, wo man vier Stunden lang sehr gut isst. Für einen spontanen Dienstagabend helfen sie dir nicht.</li>
<li><strong>Influencer</strong> kennen die besten Adressen der Stadt – aber ihre Tipps stecken in Instagram-Stories, sind nach drei Tagen weg und lassen sich nicht durchsuchen. Und bei manchen weiss man nie, ob der Post bezahlt war.</li>
<li><strong>Google</strong> zeigt dir 400 Restaurants mit 4,3 Sternen. Danke.</li>
</ul>
<p>Was fehlt, ist ein Ort, an dem all das gebündelt, durchsuchbar und ehrlich ist. Das hier ist der Versuch.</p>
<h2>Was macht der Gastroführer anders?</h2>
<h3>1. Er fragt nach dem Anlass, nicht nach der Adresse</h3>
<p>Das gleiche Restaurant kann am Freitag perfekt und am Montag falsch sein. Erstes Date, Geschäftsessen, Familienabend, schnell etwas Gutes nach dem Training: jedes Mal zählen andere Dinge. Sternebewertungen können das nicht abbilden.</p>
<p>Darum arbeitet der Gastroführer mit der <strong>Spinne</strong>. Sie hat sieben Achsen: Schick, Ambiente, Weinkarte, Essen, Service, Günstig und Sehen und gesehen werden. Auf jeder Achse ziehst du den Punkt dorthin, wo dein Abend liegt – von 1 bis 5. Alles, was heute keine Rolle spielt, schaltest du auf «egal». So grenzt du in ein paar Sekunden ein, was heute wirklich wichtig ist:</p>
<div class="box">
<ul>
<li><strong>Erstes Date:</strong> Ambiente hoch, Sehen und gesehen werden tief, Weinkarte solide – Preis egal.</li>
<li><strong>Geschäftsessen:</strong> Schick, Service und Essen hoch – der Rest egal.</li>
<li><strong>Freunde am Dienstag:</strong> Günstig und Essen hoch, alles andere egal.</li>
<li><strong>Grosser Auftritt:</strong> Sehen und gesehen werden auf 5, Schick auf 5 – das Essen darf Nebensache sein.</li>
</ul>
</div>
<p>Jedes Lokal ist auf denselben sieben Achsen bewertet. Die Spinne legt dein Wunschprofil über jedes davon und rechnet aus, wie gut es passt – als Prozentzahl, sortiert von oben nach unten. Kein Sterne-Durchschnitt, sondern eine Antwort auf deine Frage von heute Abend.</p>
<h3>2. Die Bewertungen kommen von Leuten, die wirklich essen gehen</h3>
<p>Zürichs Food-Influencer bewerten ihre Lokale direkt bei uns – auf denselben sieben Achsen. Für sie heisst das mehr Reichweite und ein Ort, an dem ihre Tipps nicht nach drei Tagen verschwinden. Für dich heisst das: Du kannst dich, wenn du willst, ganz auf die Stimme verlassen, der du vertraust. Nur eine. Oder alle zusammen als Durchschnitt.</p>
<h3>3. Community: dein Rating zählt</h3>
<p>Du kannst jedes Lokal selbst bewerten. Deine Bewertungen fliessen in die Gesamtnote ein. Und wie bei Spotify teilst du deine Liste mit einem Link: «Meine zehn Lieblingsitaliener», «Beste Terrassen am See», «Wo ich mit Kunden hingehe».</p>
<p>Wer viel und gut bewertet, wird sichtbar: Die stärksten Community-Stimmen landen im selben Dropdown wie die Influencer. Reichweite gibt es bei uns fürs Bewerten, nicht fürs Bezahlen.</p>
<h2>So funktioniert's</h2>
<ol>
<li><strong>Heute habe ich Lust auf …</strong> – Küche wählen oder «Überrasch mich».</li>
<li><strong>Wo?</strong> – Stadt und Kreise wählen.</li>
<li><strong>Mir ist wichtig</strong> – Spinne einstellen, Unwichtiges auf «egal».</li>
<li><strong>Wem vertraue ich?</strong> – Alle, meine Liste oder eine einzelne Stimme.</li>
<li><strong>Deine Treffer</strong> – das Ranking, das zu deinem Abend passt.</li>
</ol>
<p>Kein Login, keine App, nichts zu installieren. Deine Bewertungen bleiben auf deinem Gerät, bis du sie teilst.</p>
<h2>Unsere Spielregeln</h2>
<ul>
<li><strong>Keine bezahlten Bewertungen.</strong> Weder von uns noch von den Kuratoren. Wer bezahlt wurde, kennzeichnet es – oder fliegt raus.</li>
<li><strong>Transparent.</strong> Du siehst immer, wessen Bewertung du gerade anschaust.</li>
<li><strong>Zürich zuerst.</strong> Klein anfangen, richtig machen, dann weiter.</li>
</ul>
<p class="status">Prototyp: Die Lokale sind zum Ausprobieren erfunden, die Influencer-Bewertungen simuliert. Diese Seite findest du jederzeit wieder über «Info».</p>`,
  en: `
<h1>What are you in the mood for?</h1>
<p class="lead">The restaurant guide that asks what you feel like – not where you happen to be.</p>
<h2>Why another restaurant guide?</h2>
<p>Because there isn't a practical one.</p>
<ul>
<li><strong>Tripadvisor</strong> is a wall of stars and tourist comments. If you live in Zurich, you won't find anything there.</li>
<li><strong>Michelin and Gault-Millau</strong> know where to eat very well for four hours. For a spontaneous Tuesday night they're no help.</li>
<li><strong>Influencers</strong> know the best spots in town – but their tips live in Instagram stories, vanish after three days and can't be searched. And with some you never know whether the post was paid.</li>
<li><strong>Google</strong> shows you 400 restaurants with 4.3 stars. Thanks.</li>
</ul>
<p>What's missing is one place where all of this is bundled, searchable and honest. This is the attempt.</p>
<h2>What makes this guide different?</h2>
<h3>1. It asks about the occasion, not the address</h3>
<p>The same restaurant can be perfect on Friday and wrong on Monday. First date, business dinner, family night, something quick and good after training: different things matter every time. Star ratings can't capture that.</p>
<p>That's why the guide works with the <strong>spider chart</strong>. It has seven axes: Fancy, Ambience, Wine list, Food, Service, Cheap and See and be seen. On each axis you drag the point to where your evening sits – from 1 to 5. Anything that doesn't matter today you switch to "skip". In a few seconds you've narrowed down what really counts tonight:</p>
<div class="box">
<ul>
<li><strong>First date:</strong> Ambience high, See and be seen low, a solid wine list – price: skip.</li>
<li><strong>Business dinner:</strong> Fancy, Service and Food high – skip the rest.</li>
<li><strong>Friends on a Tuesday:</strong> Cheap and Food high, skip everything else.</li>
<li><strong>Big night out:</strong> See and be seen at 5, Fancy at 5 – the food can be a side note.</li>
</ul>
</div>
<p>Every place is rated on the same seven axes. The chart lays your wishes over each of them and works out how well they match – as a percentage, sorted top to bottom. Not a star average, but an answer to tonight's question.</p>
<h3>2. Ratings come from people who actually go out to eat</h3>
<p>Zurich's food influencers rate their places directly with us – on the same seven axes. For them it means more reach and a home where their tips don't disappear after three days. For you it means you can rely entirely on the voice you trust, if you want. Just one. Or everyone together as an average.</p>
<h3>3. Community: your rating counts</h3>
<p>You can rate any place yourself. Your ratings feed into the overall score. And like on Spotify, you share your list with a link: "My ten favourite Italians", "Best terraces by the lake", "Where I take clients".</p>
<p>Rate a lot and rate well, and you become visible: the strongest community voices end up in the same dropdown as the influencers. Here, reach is earned by rating, not by paying.</p>
<h2>How it works</h2>
<ol>
<li><strong>Today I feel like …</strong> – pick a cuisine or "Surprise me".</li>
<li><strong>Where?</strong> – pick the city and districts.</li>
<li><strong>What matters to me</strong> – set the chart, skip what doesn't matter.</li>
<li><strong>Whose ratings do I trust?</strong> – everyone, my list or a single voice.</li>
<li><strong>Your matches</strong> – the ranking that fits your evening.</li>
</ol>
<p>No login, no app, nothing to install. Your ratings stay on your device until you share them.</p>
<h2>Our rules</h2>
<ul>
<li><strong>No paid ratings.</strong> Not from us, not from the curators. Anyone who was paid says so – or is out.</li>
<li><strong>Transparent.</strong> You always see whose rating you're looking at.</li>
<li><strong>Zurich first.</strong> Start small, do it right, then expand.</li>
</ul>
<p class="status">Prototype: the places are made up for testing and the influencer ratings are simulated. You can reopen this page any time via "About".</p>`
};
const intro = document.getElementById('intro');
function drawIntro() { document.getElementById('intro-body').innerHTML = INTRO[lang] || INTRO.de; }
function openIntro() { drawIntro(); intro.showModal(); intro.querySelector('.body').scrollTop = 0; }
document.getElementById('btn-info').addEventListener('click', openIntro);
document.getElementById('intro-x').addEventListener('click', () => intro.close());
document.getElementById('intro-close').addEventListener('click', () => { intro.close(); try { localStorage.setItem(LS_INTRO, '1'); } catch {} });
intro.addEventListener('close', () => { try { localStorage.setItem(LS_INTRO, '1'); } catch {} });

// ---------- Teilen ----------
function encodeShare() { return btoa(unescape(encodeURIComponent(JSON.stringify({ v: 3, w: wish, a: artFilter, k: selKur, c: city, d: kreise, o: own })))); }
function decodeShare(s) { return JSON.parse(decodeURIComponent(escape(atob(s)))); }
document.getElementById('btn-share').addEventListener('click', async () => {
  const url = location.origin + location.pathname + '#s=' + encodeShare();
  try { await navigator.clipboard.writeText(url); toast(t('linkCopied')); } catch { prompt(t('shareLink'), url); }
});
(function checkShare() {
  const m = location.hash.match(/^#s=(.+)$/); if (!m) return;
  try {
    pendingShare = decodeShare(m[1]);
    document.getElementById('share-text').textContent = t('shareText', { art: pendingShare.a ? ' (' + artName(pendingShare.a) + ')' : '', n: Object.keys(pendingShare.o || {}).length });
    document.getElementById('share-banner').classList.add('show');
  } catch { toast(t('shareBad')); }
  history.replaceState(null, '', location.pathname);
})();
document.getElementById('share-accept').addEventListener('click', () => {
  const p = pendingShare; if (!p) return;
  if (Array.isArray(p.w) && p.w.length === N) wish = p.w;
  if (typeof p.a === 'string') artFilter = p.a;
  if (Array.isArray(p.k)) selKur = p.k;
  if (typeof p.c === 'string' && CITIES[p.c]) city = p.c;
  if (Array.isArray(p.d)) kreise = p.d;
  if (p.o && typeof p.o === 'object') Object.assign(own, p.o);
  pendingShare = null; document.getElementById('share-banner').classList.remove('show'); save(); render(); toast(t('shareTaken'));
});
document.getElementById('share-dismiss').addEventListener('click', () => { pendingShare = null; document.getElementById('share-banner').classList.remove('show'); });

// ---------- Daten ----------
async function loadCurators() {
  try { const res = await fetch('kuratoren.json?v=' + GF_VERSION); if (!res.ok) throw new Error(res.status); const d = await res.json(); if (Array.isArray(d.kuratoren) && d.kuratoren.length) curators = d.kuratoren; selKur = selKur.filter(id => id === MINE || curators.some(k => k.id === id)); } catch {}
  render();
}
async function loadBase() {
  try { const res = await fetch('restaurants.json?v=' + GF_VERSION); if (!res.ok) throw new Error(res.status); const d = await res.json(); base = (Array.isArray(d) ? d : d.restaurants || []).filter(r => r?.name && Array.isArray(r.values) && r.values.length === N); }
  catch { toast(t('noData')); }
  render();
}

// ---------- Render ----------
function render() { drawPlace(); drawTiles(); drawRadar(); drawOverlayInfo(); drawCurators(); drawList(); }
let resizeT; window.addEventListener('resize', () => { clearTimeout(resizeT); resizeT = setTimeout(drawRadar, 120); });
(function jumpBtn() {
  const btn = document.getElementById('jump'), list = document.getElementById('step-list');
  btn.addEventListener('click', () => list.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => btn.classList.toggle('show', !e.isIntersecting && window.scrollY > 200), { threshold: 0.05 }).observe(list);
})();
document.getElementById('app-version').textContent = 'v' + GF_VERSION;
document.getElementById('footer-version').textContent = 'Gastroführer v' + GF_VERSION;
applyLangStatic();
render();
loadCurators();
loadBase();
let introSeen = false; try { introSeen = localStorage.getItem(LS_INTRO) === '1'; } catch {}
if (!introSeen) openIntro();
