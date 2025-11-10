<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Danh sách bệnh nhân</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 5px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h2>Patients List</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Address</th>
                <th>Health Insurance</th>
                <th>Created At</th>
            </tr>
        </thead>
        <tbody>
            @foreach($patients as $p)
                <tr>
                    <td>{{ $p['ID'] }}</td>
                    <td>{{ $p['Name'] }}</td>
                    <td>{{ $p['Email'] }}</td>
                    <td>{{ $p['Phone'] }}</td>
                    <td>{{ $p['Date of Birth'] }}</td>
                    <td>{{ $p['Gender'] }}</td>
                    <td>{{ $p['Address'] }}</td>
                    <td>{{ $p['Health Insurance'] }}</td>
                    <td>{{ $p['Created At'] }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
