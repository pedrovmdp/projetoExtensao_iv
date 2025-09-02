import loucao from '/loucao.png';

export default function UserProfile() {
    const users = {
        name: "Professor Marques",
        login: "professor@professor.com",
        img: loucao
    };

    return (
        <div className="p-4 border border-blue-600 bg-blue-700 rounded-md w-full text-white">
            <div className="flex items-center gap-4">
                <img
                    src={users.img}
                    alt="imagem do usuário"
                    className="w-15 h-15 rounded-full object-cover"
                />
                <div className="max-w-[160px]">
                    <p className="text-lg font-semibold break-words whitespace-normal">
                        {users.name}
                    </p>
                    <p className="text-sm text-white/80 break-words whitespace-normal">
                        <strong>Login:</strong> {users.login}
                    </p>
                </div>
            </div>
        </div>
    );

}
