import logo from '/logo.png'

export default function Logo() {
    return (
        <div className="flex items-center gap-3 pl-1 pt-2 pr-1">
            <div>
              <img src={logo} alt='logo do insituto diomicio freitas'/>
            </div>
            <div className="text-white">
              <h1 className="text-lg font-bold">Instituto Diomício Freitas</h1>
            </div>
        </div>
    )
}