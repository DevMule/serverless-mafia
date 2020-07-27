export function showChat()
{
    if (document.getElementById('chat').style.display === 'none')
    {
        document.getElementById('chat').style.display = 'flex';
        document.getElementById('info').style.display = 'grid';
        document.getElementById('chat-rules').innerText = 'Hide chat';
    }
    else
    {
        document.getElementById('chat').style.display = 'none';
        document.getElementById('chat-rules').innerText = 'Show chat';

        if (document.getElementById('log').style.display === 'none')
        {
            document.getElementById('info').style.display = 'none';
        }
    }
}

export function showLogs()
{
    if (document.getElementById('log').style.display === 'none')
    {
        document.getElementById('log').style.display = 'flex';
        document.getElementById('info').style.display = 'grid';
        document.getElementById('log-rules').innerText = 'Hide logs';
    }
    else
    {
        document.getElementById('log').style.display = 'none';
        document.getElementById('log-rules').innerText = 'Show logs';

        if (document.getElementById('chat').style.display === 'none')
        {
            document.getElementById('info').style.display = 'none';
        }
    }
}
