del ..\contribution.xml /q

type ..\..\org.scn.community.shared\templates.main\contribution.xml.head.txt ^
..\templates\contribution.xml.head.txt ^
..\..\org.scn.community.shared\templates.main\eula.xml.txt ^
..\..\org.scn.community.shared\templates.main\license.xml.txt ^
..\templates\contribution.xml.groups.txt ^
..\res\DataTable\def\contribution.xml ^
..\res\DropDown\def\contribution.xml ^
..\res\D3Hier\def\contribution.xml ^
..\res\FacetFilter\def\contribution.xml ^
..\res\HexBin\def\contribution.xml ^
..\res\LeaderBoard\def\contribution.xml ^
..\res\MarimekkoChart\def\contribution.xml ^
..\res\MultiLevelDropDown\def\contribution.xml ^
..\res\Projector\def\contribution.xml ^
..\res\RangeSlider\def\contribution.xml ^
..\res\Slider\def\contribution.xml ^
..\res\Table2D\def\contribution.xml ^
..\res\TopFlop\def\contribution.xml ^
..\res\TopFlopChart\def\contribution.xml ^
..\..\org.scn.community.shared\templates.main\contribution.xml.close.txt > ^
..\contribution.xml

del ..\contribution.ztl /q

type ..\..\org.scn.community.shared\templates.main\contribution.ztl.head.txt ^
..\templates\contribution.ztl.head.txt ^
..\..\org.scn.community.shared\templates.main\license.js.txt ^
..\res\DataTable\def\contribution.ztl ^
..\res\DropDown\def\contribution.ztl ^
..\res\D3Hier\def\contribution.ztl ^
..\res\FacetFilter\def\contribution.ztl ^
..\res\HexBin\def\contribution.ztl ^
..\res\LeaderBoard\def\contribution.ztl ^
..\res\MarimekkoChart\def\contribution.ztl ^
..\res\MultiLevelDropDown\def\contribution.ztl ^
..\res\Projector\def\contribution.ztl ^
..\res\RangeSlider\def\contribution.ztl ^
..\res\Slider\def\contribution.ztl ^
..\res\Table2D\def\contribution.ztl ^
..\res\TopFlop\def\contribution.ztl ^
..\res\TopFlopChart\def\contribution.ztl ^
..\..\org.scn.community.shared\templates.main\contribution.ztl.close.txt > ^
..\contribution.ztl

del ..\META-INF\MANIFEST.MF /q

type ..\..\org.scn.community.shared\templates.main\MANIFEST.MF ^
..\templates\MANIFEST.MF > ^
..\META-INF\MANIFEST.MF
