function Lum($h){ $h=$h.TrimStart('#'); $c=@(); foreach($i in 0,2,4){ $v=[Convert]::ToInt32($h.Substring($i,2),16)/255; if($v -le 0.03928){$c+=$v/12.92}else{$c+=[math]::Pow(($v+0.055)/1.055,2.4)} }; 0.2126*$c[0]+0.7152*$c[1]+0.0722*$c[2] }
function Razao($a,$b){ $x=Lum $a; $y=Lum $b; $hi=[math]::Max($x,$y); $lo=[math]::Min($x,$y); [math]::Round(($hi+0.05)/($lo+0.05),2) }
$claro=@{fundo='#F7F8FA';sup='#FFFFFF';elev='#FFFFFF';texto='#1A2233';suave='#5B667A';borda='#D9DEE7';campo='#7C879B';dest='#2B5BFF';desth='#1E46D4';destt='#2B5BFF';destsuave='#E8EEFF';sobre='#FFFFFF';perigo='#B3261E';perigoh='#8E1E18';erro='#B3261E';erroF='#FDEDED';suc='#166B42';sucF='#EDF7F0';avi='#8A5B00';aviF='#FFF8E6';cod='#0F172A';codt='#E2E8F0'}
$escuro=@{fundo='#10141D';sup='#182030';elev='#202B40';texto='#F0F4FA';suave='#9AA7BD';borda='#2C3A54';campo='#6B7A99';dest='#4A6DE8';desth='#3F5FD0';destt='#7B9DFF';destsuave='#22305E';sobre='#FFFFFF';perigo='#C73636';perigoh='#B02B2B';erro='#FF6B6B';erroF='#2D1416';suc='#34D399';sucF='#12281E';avi='#FBBF24';aviF='#2E2410';cod='#090D15';codt='#F0F4FA'}
$pairs=@(@('texto','fundo'),@('texto','sup'),@('texto','elev'),@('suave','fundo'),@('suave','sup'),@('suave','elev'),@('sobre','dest'),@('sobre','desth'),@('sobre','perigo'),@('sobre','perigoh'),@('destt','fundo'),@('destt','sup'),@('destt','elev'),@('destt','destsuave'),@('texto','destsuave'),@('suave','destsuave'),@('erro','fundo'),@('erro','sup'),@('erro','elev'),@('erro','erroF'),@('suc','fundo'),@('suc','sup'),@('suc','elev'),@('suc','sucF'),@('avi','fundo'),@('avi','sup'),@('avi','aviF'),@('codt','cod'),@('campo','sup'),@('campo','fundo'),@('dest','fundo'),@('dest','sup'))
foreach($nome in 'claro','escuro'){
  if($nome -eq 'claro'){ $p=$claro } else { $p=$escuro }
  "== $nome"
  foreach($q in $pairs){ "{0,-7} / {1,-9} {2}" -f $q[0],$q[1],(Razao $p[$q[0]] $p[$q[1]]) }
}
