import loucao from '/loucao.png';

export default function UserProfile() {
    const users = {
        name: "Professor Marques",
        login: "professor@professor.com",
        img: loucao
    };

    return (
        <div className="p-4 border border-blue-600 bg-blue-700 rounded-md max-w-md text-white">
            <div className="flex items-center gap-4">
                <img
                    src={users.img}
                    alt="imagem do usuário"
                    className="w-15 h-15 rounded-full object-cover"
                />
                <div>
                    <p className="text-lg font-semibold">{users.name}</p>
                    <p className="text-sm text-white/80">Login: {users.login}</p>
                </div>
            </div>
        </div>
    );
}
